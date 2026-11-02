/** Chống thêm trùng một từ liên tiếp (URL đổi nhưng cùng từ, F5, ...). */
export class RecentWordsGuard {
  #seen = new Map();
  #ttlMs;

  constructor(ttlMs = 60_000) {
    this.#ttlMs = ttlMs;
  }

  /** @returns {boolean} true nếu từ này mới (chưa thêm gần đây). */
  tryAcquire(scopeKey, word, now = Date.now()) {
    const key = `${scopeKey}|${word.key}`;
    const last = this.#seen.get(key);
    if (last !== undefined && now - last < this.#ttlMs) return false;
    this.#seen.set(key, now);
    return true;
  }

  release(scopeKey, word) {
    this.#seen.delete(`${scopeKey}|${word.key}`);
  }
}
