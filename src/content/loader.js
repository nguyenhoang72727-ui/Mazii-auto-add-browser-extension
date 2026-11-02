// Content scripts của MV3 không dùng được ES module trực tiếp,
// nên loader này nạp composition root dạng module.
import(chrome.runtime.getURL("src/content/main.js"));
