/**
 * Tìm token đăng nhập Mazii trong storage của trang (đang đăng nhập sẵn).
 * Không phụ thuộc tên key cụ thể: thử key quen thuộc trước, sau đó quét mọi
 * giá trị trông giống JWT, kể cả khi token nằm lồng trong một chuỗi JSON.
 */
export class AuthTokenProvider {
  static JWT = /^eyJ[\w-]+\.[\w-]+\.[\w-]+$/;
  static TOKEN_FIELDS = ["accessToken", "access_token", "token", "jwt", "idToken"];

  constructor(preferredKeys = ["token", "accessToken", "access_token", "mazii_token"]) {
    this.preferredKeys = preferredKeys;
  }

  /** Nguồn dự phòng khi chưa bắt được header từ trang. */
  getHeaders() {
    const token = this.getToken();
    return token ? { authorization: `Bearer ${token}` } : {};
  }

  /** @returns {string|null} */
  getToken() {
    for (const storage of [localStorage, sessionStorage]) {
      const token = this.#fromStorage(storage);
      if (token) return token;
    }
    return null;
  }

  #fromStorage(storage) {
    const keys = [
      ...this.preferredKeys,
      ...Array.from({ length: storage.length }, (_, i) => storage.key(i)),
    ];
    for (const key of keys) {
      const raw = storage.getItem(key);
      const token = raw && this.#extract(raw);
      if (token) return token;
    }
    return null;
  }

  #extract(raw) {
    const plain = raw.replace(/^"|"$/g, "");
    if (AuthTokenProvider.JWT.test(plain)) return plain;
    try {
      return this.#findInObject(JSON.parse(raw), 0);
    } catch {
      return null;
    }
  }

  #findInObject(value, depth) {
    if (depth > 4 || value === null || typeof value !== "object") return null;
    for (const field of AuthTokenProvider.TOKEN_FIELDS) {
      const candidate = value[field];
      if (typeof candidate === "string" && candidate.length > 20) return candidate;
    }
    for (const child of Object.values(value)) {
      const found = this.#findInObject(child, depth + 1);
      if (found) return found;
    }
    return null;
  }
}
