/** Chỉ lo DOM của popup; không chứa logic nghiệp vụ. */
export class PopupView {
  #enabled = document.getElementById("enabled");
  #select = document.getElementById("notebook");
  #status = document.getElementById("status");

  onEnabledChange(handler) {
    this.#enabled.addEventListener("change", () => handler(this.#enabled.checked));
  }

  onNotebookChange(handler) {
    this.#select.addEventListener("change", () => {
      const option = this.#select.selectedOptions[0];
      handler(
        option?.value
          ? { id: option.value, name: option.dataset.fullName ?? option.textContent }
          : null,
      );
    });
  }

  setEnabled(value) {
    this.#enabled.checked = value;
  }

  /** Sổ nằm trong thư mục được gom thành nhóm (optgroup) theo tên thư mục. */
  renderNotebooks(notebooks, selectedId) {
    this.#select.replaceChildren(new Option("-- Chọn sổ tay --", ""));
    const groups = new Map();

    for (const n of notebooks) {
      const option = new Option(n.name, n.id, false, String(n.id) === String(selectedId));
      option.dataset.fullName = n.fullName ?? n.name;

      if (!n.parentName) {
        this.#select.add(option);
        continue;
      }
      if (!groups.has(n.parentName)) {
        const group = document.createElement("optgroup");
        group.label = n.parentName;
        groups.set(n.parentName, group);
        this.#select.appendChild(group);
      }
      groups.get(n.parentName).appendChild(option);
    }
    this.#select.disabled = false;
  }

  showStatus(message, isError = false) {
    this.#status.textContent = message;
    this.#status.classList.toggle("error", isError);
  }
}
