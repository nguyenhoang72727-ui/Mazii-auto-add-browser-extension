/** Value object: một từ vừa tra (kèm nghĩa nếu đã biết). */
export class Word {
  #text;
  #dictionary;
  #details;

  /** @param {import("./WordDetails.js").WordDetails|null} details */
  constructor(text, dictionary = "javi", details = null) {
    const trimmed = String(text ?? "").trim();
    if (!trimmed) throw new Error("Word text must not be empty");
    this.#text = trimmed;
    this.#dictionary = dictionary;
    this.#details = details;
  }

  get text() {
    return this.#text;
  }

  get dictionary() {
    return this.#dictionary;
  }

  get details() {
    return this.#details;
  }

  get key() {
    return `${this.#dictionary}:${this.#text}`;
  }
}
