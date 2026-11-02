import { LookupDetector } from "./LookupDetector.js";
import { Word } from "../domain/Word.js";
import { WordDetails } from "../domain/WordDetails.js";

/**
 * Phát hiện tra từ qua request lưu lịch sử của chính trang Mazii.
 * Request này mang sẵn từ, nghĩa và cách đọc; id từ điển (idx) lấy từ request get-mean.
 */
export class HistoryLookupDetector extends LookupDetector {
  static FRESH_SECONDS = 120; // bỏ qua mục lịch sử cũ khi trang đồng bộ hàng loạt
  static ID_WAIT_MS = 700; // chờ get-mean để có idx

  #messages;
  #wordIds = new Map();
  #unsubscribers = [];

  /** @param {import("./PageMessageSource.js").PageMessageSource} pageMessages */
  constructor(pageMessages) {
    super();
    this.#messages = pageMessages;
  }

  start(onLookup) {
    this.#unsubscribers.push(
      this.#messages.on("meanRequest", (body) => this.#rememberId(body)),
      this.#messages.on("history", (body) => this.#handleHistory(body, onLookup)),
    );
  }

  stop() {
    this.#unsubscribers.forEach((unsubscribe) => unsubscribe());
    this.#unsubscribers = [];
  }

  #rememberId(body) {
    if (body?.word && body.wordId != null) this.#wordIds.set(body.word, Number(body.wordId));
  }

  #handleHistory(body, onLookup) {
    for (const entry of body?.data ?? []) {
      if (!this.#isFreshWord(entry)) continue;
      setTimeout(() => onLookup(this.#toWord(entry)), HistoryLookupDetector.ID_WAIT_MS);
    }
  }

  #isFreshWord(entry) {
    return (
      entry?.type === "word" &&
      Boolean(entry.content) &&
      Boolean(entry.mean) &&
      this.#ageSeconds(entry) <= HistoryLookupDetector.FRESH_SECONDS
    );
  }

  #ageSeconds(entry) {
    const raw = entry.created_at ?? entry.sync_timestamp;
    if (!raw) return Infinity;
    const seconds = raw > 1e12 ? raw / 1000 : raw;
    return Math.abs(Date.now() / 1000 - seconds);
  }

  #toWord(entry) {
    const details = new WordDetails({
      meaning: entry.mean,
      phonetic: entry.phonetic ?? "",
      idx: this.#wordIds.get(entry.content) ?? 0,
    });
    return new Word(entry.content, entry.dict ?? "javi", details);
  }
}
