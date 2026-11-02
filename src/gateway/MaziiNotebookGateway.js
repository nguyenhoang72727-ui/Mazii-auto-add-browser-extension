import { NotebookGateway } from "./NotebookGateway.js";
import { Notebook } from "../domain/Notebook.js";

export class MaziiNotebookGateway extends NotebookGateway {
  #http;
  #endpoints;

  constructor(httpClient, endpoints) {
    super();
    this.#http = httpClient;
    this.#endpoints = endpoints;
  }

  /** Danh sách phẳng các sổ tay chứa được từ; sổ trong thư mục mang parentName. */
  async listNotebooks() {
    const top = await this.#fetchCategories();
    const notebooks = [];

    for (const category of top) {
      if (category.childCount > 0) {
        for (const child of await this.#fetchCategories(category.id)) {
          notebooks.push(new Notebook(child.id, child.name, category.name));
        }
      }
      // Thư mục chỉ chứa sổ con thì không chọn được; sổ thường (hoặc thư mục có từ riêng) thì chọn được.
      if (category.childCount === 0 || category.notesCount > 0) {
        notebooks.push(new Notebook(category.id, category.name));
      }
    }
    return notebooks;
  }

  /** Lưu từ (đã có nghĩa) vào sổ tay, giống thao tác bấm "+" trên Mazii. */
  async addWord(notebookId, word) {
    if (!word.details) throw new Error("Chưa có nghĩa của từ");
    await this.#http.request(this.#endpoints.addNote(notebookId, word));
  }

  async #fetchCategories(parentId = null) {
    const json = await this.#http.request(this.#endpoints.listCategories(parentId));
    return this.#endpoints.parseCategories(json);
  }
}
