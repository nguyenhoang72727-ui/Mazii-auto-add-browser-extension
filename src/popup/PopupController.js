export class PopupController {
  #view;
  #settingsRepo;
  #notebookClient;

  constructor({ view, settingsRepository, notebookClient }) {
    this.#view = view;
    this.#settingsRepo = settingsRepository;
    this.#notebookClient = notebookClient;
  }

  async init() {
    const settings = await this.#settingsRepo.load();
    this.#view.setEnabled(settings.enabled);

    this.#view.onEnabledChange((enabled) => this.#onEnabledChange(enabled));
    this.#view.onNotebookChange((notebook) => this.#onNotebookChange(notebook));

    try {
      const notebooks = await this.#notebookClient.listNotebooks();
      this.#view.renderNotebooks(notebooks, settings.notebookId);
    } catch (error) {
      this.#view.showStatus(error.message, true);
    }
  }

  async #onEnabledChange(enabled) {
    await this.#settingsRepo.save({ enabled });
    const { notebookId } = await this.#settingsRepo.load();
    if (enabled && !notebookId) {
      this.#view.showStatus("Chọn sổ tay để bắt đầu tự động thêm", true);
      return;
    }
    this.#view.showStatus(enabled ? "Đã bật tự động thêm" : "Đã tắt");
  }

  async #onNotebookChange(notebook) {
    await this.#settingsRepo.save({
      notebookId: notebook?.id ?? null,
      notebookName: notebook?.name ?? null,
    });
    this.#view.showStatus(notebook ? `Sổ tay: ${notebook.name}` : "");
  }
}
