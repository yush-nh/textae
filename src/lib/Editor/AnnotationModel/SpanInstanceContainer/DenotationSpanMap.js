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

  get(spanID) {
    return this.#idMap.get(spanID)
  }

  getSameBeginEnd(spanID) {
    const entry = this.#idMap.get(spanID)
    if (!entry) return null

    const beginEndKey = this.#getBeginEndKey(entry)
    return this.#beginEndMap.get(beginEndKey)
  }

  has(spanID) {
    return this.#idMap.has(spanID)
  }

  delete(spanID) {
    const span = this.#idMap.get(spanID)

    if (span) {
      const beginEndKey = this.#getBeginEndKey(span)
      this.#beginEndMap.get(beginEndKey).delete(span)

      if (this.#beginEndMap.get(beginEndKey).size === 0) {
        this.#beginEndMap.delete(beginEndKey)
      }

      return this.#idMap.delete(spanID)
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

  #getBeginEndKey(span) {
    return span.begin & span.end
  }
}
