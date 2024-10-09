export default class DefinedType {
  #id
  #color
  #label
  #default

  constructor(id, color, label, isDefault) {
    this.#id = id
    this.#color = color
    this.#label = label
    this.#default = isDefault
  }

  get id() {
    return this.#id
  }

  get color() {
    return this.#color
  }

  get label() {
    return this.#label
  }

  get default() {
    return this.#default
  }

  toJSON() {
    return {
      id: this.#id,
      color: this.#color,
      label: this.#label,
      default: this.#default
    }
  }
}
