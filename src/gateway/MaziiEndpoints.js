/**
 * Mô tả các API của Mazii + cách đọc response. Mọi giả định nằm ở đây.
 * Đã xác nhận từ Network:
 *  - POST /api/get-category-v2 (thêm parentCateId để lấy sổ con của thư mục)
 *    -> result.data[] { categoryId, categoryName, parent_cate_id, child_count, notes_count }
 *  - POST /api/add-note
 */
export class MaziiEndpoints {
  constructor(baseUrl = "https://api.mazii.net/api") {
    this.baseUrl = baseUrl;
  }

  /** @param {number|string|null} parentId id thư mục cha; bỏ trống để lấy danh sách ngoài cùng */
  listCategories(parentId = null) {
    return {
      method: "POST",
      url: `${this.baseUrl}/get-category-v2`,
      body: {
        page: 1,
        limit: 9999,
        search: "",
        sort: "newest",
        ...(parentId != null ? { parentCateId: Number(parentId) } : {}),
      },
    };
  }

  /** @param {import("../domain/Word.js").Word} word (phải có details) */
  addNote(notebookId, word) {
    const { meaning, phonetic, idx } = word.details;
    return {
      method: "POST",
      url: `${this.baseUrl}/add-note`,
      body: {
        noteName: word.text,
        noteMean: meaning,
        phonetic,
        categoryId: Number(notebookId),
        idx,
        comment: "",
        date: new Date().toISOString(),
        type: "word",
      },
    };
  }

  /** @returns {{id:number, name:string, parentId:number, childCount:number, notesCount:number}[]} */
  parseCategories(json) {
    const rows = json?.result?.data;
    if (!Array.isArray(rows)) {
      const keys = json && typeof json === "object" ? Object.keys(json).join(", ") : typeof json;
      throw new Error(`Không đọc được response get-category-v2 (các key: ${keys})`);
    }
    return rows.map((r) => ({
      id: r.categoryId,
      name: r.categoryName,
      parentId: r.parent_cate_id ?? 0,
      childCount: r.child_count ?? 0,
      notesCount: r.notes_count ?? 0,
    }));
  }
}
