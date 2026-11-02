/** Abstraction: phát hiện người dùng vừa tra một từ. */
export class LookupDetector {
  /** @param {(word: import("../domain/Word.js").Word) => void} _onLookup */
  start(_onLookup) {
    throw new Error("Not implemented");
  }

  stop() {
    throw new Error("Not implemented");
  }
}
