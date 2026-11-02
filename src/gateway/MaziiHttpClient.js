/** Chỉ lo việc gọi HTTP tới API Mazii (header xác thực + parse JSON). */
export class MaziiHttpClient {
  #authHeaders;

  /** @param {{ getHeaders(): Record<string,string> }} authHeaders */
  constructor(authHeaders) {
    this.#authHeaders = authHeaders;
  }

  async request({ method, url, body }) {
    const headers = {
      ...this.#authHeaders.getHeaders(),
      ...(body ? { "Content-Type": "application/json" } : {}),
    };

    // Không dùng credentials: API trả Allow-Origin '*' nên trình duyệt sẽ chặn.
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401 || response.status === 403) {
      throw new Error("Mazii từ chối (401/403): hãy F5 trang Mazii rồi thử lại");
    }
    if (!response.ok) throw new Error(`Mazii API ${response.status}`);

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  }
}
