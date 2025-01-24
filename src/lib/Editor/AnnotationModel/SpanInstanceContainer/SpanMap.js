// When a span is moved, a new ID is issued.
// Redo of the operation works with the same parameters as the original operation.
// When you undo the span move, the span ID changes.
// If you specify the span to be moved by ID, redo will not work as expected.
// If you specify it by begin and end positions, move, undo and redo will all work as expected.
// For this reason, this data structure is designed to obtain spans by start and end.
export default class SpanMap {
  // The map that has span id as a key and span instance as a value.
  #idMap = new Map()

  // The map that has begin & end as a key
  // and a set of span instances as a value.
  #beginEndMap = new Map()

  set(spanID, span) {
    this.#idMap.set(spanID, span)

    const beginEndKey = this.#getBeginEndKey(span.begin, span.end)
    if (this.#beginEndMap.has(beginEndKey)) {
      this.#beginEndMap.get(beginEndKey).add(span)
    } else {
      this.#beginEndMap.set(beginEndKey, new Set([span]))
    }
  }

  get(spanID) {
    return this.#idMap.get(spanID)
  }

  getSameBeginEnd(begin, end) {
    const beginEndKey = this.#getBeginEndKey(begin, end)
    return this.#beginEndMap.get(beginEndKey)
  }

  getSingleOrThrowOn(begin, end) {
    const beginEndKey = this.#getBeginEndKey(begin, end)
    const spans = this.#beginEndMap.get(beginEndKey)

    if (spans.size === 1) {
      return spans.values().next().value
    }

    throw new Error('The span is not unique.')
  }

  has(spanID) {
    return this.#idMap.has(spanID)
  }

  delete(spanID) {
    const span = this.#idMap.get(spanID)

    if (span) {
      const beginEndKey = this.#getBeginEndKey(span.begin, span.end)
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

  #getBeginEndKey(begin, end) {
    return begin * 10000000 + end
  }
}
