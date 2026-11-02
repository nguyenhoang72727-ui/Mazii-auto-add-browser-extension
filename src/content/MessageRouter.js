import { MessageType } from "../shared/constants.js";

/** Nhận message từ popup và điều phối tới handler tương ứng (OCP: thêm handler không sửa lớp). */
export class MessageRouter {
  #handlers = new Map();

  register(type, handler) {
    this.#handlers.set(type, handler);
    return this;
  }

  listen() {
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      const handler = this.#handlers.get(message?.type);
      if (!handler) return false;
      Promise.resolve()
        .then(() => handler(message))
        .then((data) => sendResponse({ ok: true, data }))
        .catch((error) => sendResponse({ ok: false, error: error.message }));
      return true; // phản hồi bất đồng bộ
    });
  }
}

export { MessageType };
