/** Nhớ header xác thực mà trang Mazii vừa dùng (do headerSniffer.js chuyển sang). */
export class PageAuthHeaders {
  static CHANNEL = "maziiAutoAdd.authHeaders";

  #headers = {};

  constructor() {
    window.addEventListener("message", (event) => {
      if (event.source !== window || event.data?.channel !== PageAuthHeaders.CHANNEL) return;
      this.#headers = { ...this.#headers, ...event.data.headers };
    });
  }

  getHeaders() {
    return { ...this.#headers };
  }
}
