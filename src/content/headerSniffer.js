// Chạy trong "MAIN world" của trang (cùng ngữ cảnh với code Mazii) để thấy request mà
// chính Mazii gửi đi, rồi chuyển cho content script:
//  - header xác thực gửi tới api.mazii.net
//  - body của request lưu lịch sử tra từ (có từ, nghĩa, cách đọc)
//  - body của request get-mean (có wordId)
(() => {
  const AUTH_CHANNEL = "maziiAutoAdd.authHeaders";
  const EVENT_CHANNEL = "maziiAutoAdd.pageEvents";
  const API_HOST = "api.mazii.net";
  const IGNORED = new Set(["content-type", "accept", "cache-control"]);
  const BODY_WATCHERS = [
    { kind: "history", match: "sync.mazii.net/sync/v2/search-history" },
    { kind: "meanRequest", match: "api.mazii.net/api/get-mean" },
  ];

  const relayHeaders = (url, headers) => {
    if (!String(url).includes(API_HOST)) return;
    const picked = {};
    for (const [name, value] of Object.entries(headers)) {
      if (!IGNORED.has(name) && value) picked[name] = String(value);
    }
    if (Object.keys(picked).length) {
      window.postMessage({ channel: AUTH_CHANNEL, headers: picked }, "*");
    }
  };

  const relayBody = (url, body) => {
    const watcher = BODY_WATCHERS.find((w) => String(url).includes(w.match));
    if (!watcher || typeof body !== "string") return;
    try {
      window.postMessage({ channel: EVENT_CHANNEL, kind: watcher.kind, body: JSON.parse(body) }, "*");
    } catch {}
  };

  const normalize = (source) => {
    const out = {};
    if (!source) return out;
    if (source instanceof Headers) source.forEach((v, k) => (out[k.toLowerCase()] = v));
    else if (Array.isArray(source)) source.forEach(([k, v]) => (out[String(k).toLowerCase()] = v));
    else Object.entries(source).forEach(([k, v]) => (out[k.toLowerCase()] = v));
    return out;
  };

  const originalFetch = window.fetch;
  window.fetch = function (input, init) {
    try {
      const url = input instanceof Request ? input.url : input;
      relayHeaders(url, { ...normalize(input instanceof Request ? input.headers : null), ...normalize(init?.headers) });
      relayBody(url, init?.body);
    } catch {}
    return originalFetch.apply(this, arguments);
  };

  const open = XMLHttpRequest.prototype.open;
  const setHeader = XMLHttpRequest.prototype.setRequestHeader;
  const send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url) {
    this.__maziiUrl = url;
    return open.apply(this, arguments);
  };
  XMLHttpRequest.prototype.setRequestHeader = function (name, value) {
    try {
      relayHeaders(this.__maziiUrl ?? "", { [String(name).toLowerCase()]: value });
    } catch {}
    return setHeader.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function (body) {
    try {
      relayBody(this.__maziiUrl ?? "", body);
    } catch {}
    return send.apply(this, arguments);
  };
})();
