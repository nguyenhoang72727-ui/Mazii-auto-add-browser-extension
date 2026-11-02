/**
 * Use case: khi tra từ mới và tính năng đang bật -> thêm vào sổ tay đã chọn.
 * Chỉ phụ thuộc abstraction (settings, gateway, detector, notifier, guard).
 */
export class AutoAddService {
  #settingsRepo;
  #gateway;
  #detector;
  #notifier;
  #guard;
  #settings = null;
  #unsubscribe = null;

  constructor({ settingsRepository, gateway, lookupDetector, notifier, guard }) {
    this.#settingsRepo = settingsRepository;
    this.#gateway = gateway;
    this.#detector = lookupDetector;
    this.#notifier = notifier;
    this.#guard = guard;
  }

  async start() {
    this.#settings = await this.#settingsRepo.load();
    this.#unsubscribe = this.#settingsRepo.subscribe((s) => (this.#settings = s));
    this.#detector.start((word) => this.#handleLookup(word));
  }

  stop() {
    this.#unsubscribe?.();
    this.#detector.stop();
  }

  async #handleLookup(word) {
    const { enabled, notebookId, notebookName } = this.#settings;
    if (!enabled || !notebookId) return;
    if (!this.#guard.tryAcquire(notebookId, word)) return;

    try {
      await this.#gateway.addWord(notebookId, word);
      this.#notifier.success(`Đã thêm "${word.text}" vào sổ tay ${notebookName ?? ""}`.trim());
    } catch (error) {
      this.#guard.release(notebookId, word);
      this.#notifier.error(`Không thêm được "${word.text}": ${error.message}`);
    }
  }
}
