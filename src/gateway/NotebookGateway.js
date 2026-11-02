/** Abstraction (DIP): giao tiếp với dịch vụ sổ tay. */
export class NotebookGateway {
  /** @returns {Promise<import("../domain/Notebook.js").Notebook[]>} */
  async listNotebooks() {
    throw new Error("Not implemented");
  }

  /** @param {string} _notebookId @param {import("../domain/Word.js").Word} _word */
  async addWord(_notebookId, _word) {
    throw new Error("Not implemented");
  }
}
