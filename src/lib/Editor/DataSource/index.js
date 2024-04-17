import toSourceString from './toSourceString'

export default class DataSource {
  #type
  #id
  #data

  constructor(type, id, data) {
    this.#type = type
    this.#id = id
    this.#data = data
  }

  get type() {
    return this.#type
  }

  get id() {
    return this.#id
  }

  get data() {
    return this.#data
  }

  get displayName() {
    return toSourceString(this.#type, this.#id)
  }
}
