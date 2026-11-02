import { MessageType } from "../shared/constants.js";

/** Hỏi content script trong tab Mazii đang mở để lấy danh sách sổ tay. */
export class ActiveTabNotebookClient {
  async listNotebooks() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.url?.startsWith("https://mazii.net/")) {
      throw new Error("Hãy mở tab mazii.net rồi mở lại popup");
    }

    let response;
    try {
      response = await chrome.tabs.sendMessage(tab.id, { type: MessageType.LIST_NOTEBOOKS });
    } catch {
      throw new Error("Tải lại trang Mazii rồi thử lại");
    }
    if (!response?.ok) throw new Error(response?.error ?? "Không lấy được sổ tay");
    return response.data;
  }
}
