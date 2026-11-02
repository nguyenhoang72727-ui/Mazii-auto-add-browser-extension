/** Gộp nhiều nguồn header xác thực; nguồn đứng trước được ưu tiên. */
export class CompositeAuthHeaders {
  #providers;

  constructor(providers) {
    this.#providers = providers;
  }

  getHeaders() {
    return this.#providers.reduceRight((acc, p) => ({ ...acc, ...p.getHeaders() }), {});
  }
}
