import { Notifier } from "./Notifier.js";

export class ToastNotifier extends Notifier {
  #durationMs;

  constructor(durationMs = 2200) {
    super();
    this.#durationMs = durationMs;
  }

  success(message) {
    this.#show(message, "#1f9d55");
  }

  error(message) {
    this.#show(message, "#d64545");
  }

  #show(message, background) {
    const el = document.createElement("div");
    el.textContent = message;
    Object.assign(el.style, {
      position: "fixed",
      right: "16px",
      bottom: "16px",
      zIndex: "2147483647",
      padding: "10px 14px",
      borderRadius: "8px",
      color: "#fff",
      font: "14px/1.3 system-ui, sans-serif",
      background,
      boxShadow: "0 4px 14px rgba(0,0,0,.25)",
    });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), this.#durationMs);
  }
}
