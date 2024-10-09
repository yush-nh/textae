import DefinedType from './DefinedType'
import getForwardMatchID from './getForwardMatchID'

export default class DefinedTypeContainer {
  /** @type {Array} **/
  #definedTypes

  // Expected values is an array of object.
  // An example of object is {"id": "Regulation","color": "#FFFF66","default": true}.
  constructor(values = []) {
    // If the order of the type definitions changes,
    // it will be treated as a change, so preserve the order.

    this.#definedTypes = values.map(
      (value) =>
        new DefinedType(value.id, value.color, value.label, value.default)
    )
  }

  has(id) {
    return this.map.has(id)
  }

  get(id) {
    return { ...this.map.get(id).toJSON() }
  }

  get default() {
    return this.#definedTypes.find((type) => type.default === true)
  }

  replace(id, newType) {
    const index = this.#definedTypes.findIndex((elem) => elem.id === id)

    if (index !== -1) {
      this.#definedTypes.splice(
        index,
        1,
        new DefinedType(
          newType.id,
          newType.color,
          newType.label,
          newType.default
        )
      )
    } else {
      this.#definedTypes.push(newType)
    }
  }

  delete(id) {
    this.#definedTypes = this.#definedTypes.filter((elem) => elem.id !== id)
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
    return this.#definedTypes
      .filter((t) => t.label)
      .filter((t) => t.label.includes(term))
  }

  get map() {
    return new Map(this.#definedTypes.map((type) => [type.id, type]))
  }

  #getConfigOf(id) {
    // Return value if perfectly matched
    if (this.has(id)) {
      return this.get(id)
    }

    // Return value if forward matched
    const forwardMatchId = getForwardMatchID(this.ids(), id)
    return this.map.get(forwardMatchId)
  }
}
