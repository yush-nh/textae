import getForwardMatchType from './getForwardMatchType'

export default class DefinedTypeContainer {
  /** @type {Array} **/
  #list

  // Expected values is an array of object.
  // An example of object is {"id": "Regulation","color": "#FFFF66","default": true}.
  constructor(values) {
    // If the order of the type definitions changes,
    // it will be treated as a change, so preserve the order.
    this.#list = values || []
  }

  has(id) {
    return this.map.has(id)
  }

  get(id) {
    return { ...this.map.get(id) }
  }

  get default() {
    return this.#list.find((type) => type.default === true)
  }

  replace(id, newType) {
    const index = this.#list.findIndex((elem) => elem.id === id)

    if (index !== -1) {
      this.#list.splice(index, 1, newType)
    } else {
      this.#list.push(newType)
    }
  }

  delete(id) {
    this.#list = this.#list.filter((elem) => elem.id !== id)
  }

  ids() {
    return this.map.keys()
  }

  getColorOf(id) {
    return this.#getConfigOf(id)?.color
  }

  getLabelOf(id) {
    return this.#getConfigOf(id)?.label
  }

  /**
   * Returns list of label includes the term.
   * @param {string} term
   * @returns {Array}
   */
  labelsIncludes(term) {
    return this.#list
      .filter((t) => t.label)
      .filter((t) => t.label.includes(term))
  }

  get map() {
    return new Map(this.#list.map((type) => [type.id, type]))
  }

  #getConfigOf(id) {
    // Return value if perfectly matched
    if (this.has(id)) {
      return this.get(id)
    }

    // Return value if forward matched
    return getForwardMatchType(this, id)
  }
}
