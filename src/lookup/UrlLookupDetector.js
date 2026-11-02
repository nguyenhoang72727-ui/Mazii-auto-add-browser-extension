import { LookupDetector } from "./LookupDetector.js";
import { Word } from "../domain/Word.js";

/**
 * Nhận diện tra từ qua URL dạng /search/word/<từ điển>/<từ>.
 * Đổi PATTERN nếu Mazii đổi cấu trúc URL.
 */
export class UrlLookupDetector extends LookupDetector {
  static PATTERN = /\/search\/word\/([a-z]+)\/([^/?#]+)/i;

  #watcher;

  constructor(navigationWatcher) {
    super();
    this.#watcher = navigationWatcher;
  }

  start(onLookup) {
    this.#watcher.start((url) => {
      const word = this.#parse(url);
      if (word) onLookup(word);
    });
  }

  stop() {
    this.#watcher.stop();
  }

  #parse(url) {
    const match = new URL(url).pathname.match(UrlLookupDetector.PATTERN);
    if (!match) return null;
    try {
      return new Word(decodeURIComponent(match[2]), match[1]);
    } catch {
      return null;
    }
  }
}
