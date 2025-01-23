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

  set(spanID, span) {
    this.#idMap.set(spanID, span)

    const beginEndKey = this.#getBeginEndKey(span)
    if (this.#beginEndMap.has(beginEndKey)) {
      this.#beginEndMap.get(beginEndKey).add(span)
    } else {
      this.#beginEndMap.set(beginEndKey, new Set([span]))
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
