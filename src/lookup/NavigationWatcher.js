/**
 * Mazii là SPA: đổi URL bằng History API mà không reload trang.
 * Lớp này gom mọi kiểu điều hướng thành một callback duy nhất.
 */
export class NavigationWatcher {
  #callback = null;
  #lastUrl = null;
  #timer = null;

  start(callback) {
    this.#callback = callback;
    this.#lastUrl = location.href;
    window.addEventListener("popstate", this.#check);
    // pushState/replaceState không bắn event nên dùng polling nhẹ.
    this.#timer = setInterval(this.#check, 400);
    callback(location.href);
  }

  stop() {
    window.removeEventListener("popstate", this.#check);
    clearInterval(this.#timer);
    this.#callback = null;
  }

  #check = () => {
    if (location.href === this.#lastUrl) return;
    this.#lastUrl = location.href;
    this.#callback?.(location.href);
  };
}
