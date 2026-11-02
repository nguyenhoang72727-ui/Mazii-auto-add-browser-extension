/** Abstraction (DIP): nơi lưu cấu hình. */
export class SettingsRepository {
  async load() {
    throw new Error("Not implemented");
  }

  async save(_patch) {
    throw new Error("Not implemented");
  }

  /** @returns {() => void} hàm huỷ đăng ký */
  subscribe(_listener) {
    throw new Error("Not implemented");
  }
}
