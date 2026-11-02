/** Nhận các sự kiện mà headerSniffer.js (trong trang) chuyển sang, chia theo loại. */
export class PageMessageSource {
  static CHANNEL = "maziiAutoAdd.pageEvents";

  #listeners = new Map();

  constructor() {
    window.addEventListener("message", (event) => {
      if (event.source !== window || event.data?.channel !== PageMessageSource.CHANNEL) return;
      for (const listener of this.#listeners.get(event.data.kind) ?? []) {
        listener(event.data.body);
      }
    });
  }

  /** @returns {() => void} hàm huỷ đăng ký */
  on(kind, listener) {
    if (!this.#listeners.has(kind)) this.#listeners.set(kind, new Set());
    this.#listeners.get(kind).add(listener);
    return () => this.#listeners.get(kind)?.delete(listener);
  }
}
