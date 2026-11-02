/** Entity: một sổ tay trên Mazii (có thể nằm trong một thư mục). */
export class Notebook {
  constructor(id, name, parentName = null) {
    this.id = id;
    this.name = name;
    this.parentName = parentName;
  }

  get fullName() {
    return this.parentName ? `${this.parentName} › ${this.name}` : this.name;
  }

  toJSON() {
    return { id: this.id, name: this.name, parentName: this.parentName, fullName: this.fullName };
  }
}
