// Denotations can have the same begin and end.
// When expanding or shrinking a span,
// We want to move the denotation spans with the same begin and end values together.
// For this reason, we use a dedicated data structure
// that can obtain a denotation spans with the same begin and end.
export default class DenotationSpanMap {
  // The map that has span id as a key and span instance as a value.
  #idMap = new Map()

  // The map that has begin & end as a key
  // and a set of span instances as a value.
  #beginEndMap = new Map()

  set(key, value) {
    this.#idMap.set(key, value)

    const beginEndKey = this.#getBeginEndKey(value)
    if (this.#beginEndMap.has(beginEndKey)) {
      this.#beginEndMap.get(beginEndKey).add(value)
    } else {
      this.#beginEndMap.set(beginEndKey, new Set([value]))
    }

    return this
  }

  get(key) {
    return this.#idMap.get(key)
  }

  getSameBeginEnd(key) {
    const entry = this.#idMap.get(key)
    if (!entry) return null

    const beginEndKey = this.#getBeginEndKey(entry)
    return this.#beginEndMap.get(beginEndKey)
  }

  has(key) {
    return this.#idMap.has(key)
  }

  delete(key) {
    const entry = this.#idMap.get(key)

    if (entry) {
      const beginEndKey = this.#getBeginEndKey(entry)
      this.#beginEndMap.get(beginEndKey).delete(entry)

      if (this.#beginEndMap.get(beginEndKey).size === 0) {
        this.#beginEndMap.delete(beginEndKey)
      }

      return this.#idMap.delete(key)
    }

    return false
  }

  clear() {
    this.#idMap.clear()
    this.#beginEndMap.clear()
  }

  values() {
    return this.#idMap.values()
  }

  #getBeginEndKey(entry) {
    return entry.begin & entry.end
  }
}
