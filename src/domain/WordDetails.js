/** Value object: nghĩa, cách đọc và id từ điển của một từ. */
export class WordDetails {
  constructor({ meaning, phonetic = "", idx = 0 }) {
    if (!meaning) throw new Error("Word meaning must not be empty");
    this.meaning = meaning;
    this.phonetic = phonetic;
    this.idx = idx;
  }
}
