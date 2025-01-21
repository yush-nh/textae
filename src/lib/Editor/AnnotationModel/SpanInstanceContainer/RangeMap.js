export default class CollectionMap {
  #idMap = new Map()
  #rangeMap = new Map()

  set(key, value) {
    this.#idMap.set(key, value)

    const rangeKey = this.#getRangeKey(value)
    if (this.#rangeMap.has(rangeKey)) {
      this.#rangeMap.get(rangeKey).add(value)
    } else {
      this.#rangeMap.set(rangeKey, new Set([value]))
    }

    return this
  }

  get(key) {
    return this.#idMap.get(key)
  }

  getSameRange(key) {
    const entry = this.#idMap.get(key)
    if (!entry) return null

    const rangeKey = this.#getRangeKey(entry)
    return this.#rangeMap.get(rangeKey)
  }

  has(key) {
    return this.#idMap.has(key)
  }

  delete(key) {
    const entry = this.#idMap.get(key)

    if (entry) {
      const rangeKey = this.#getRangeKey(entry)
      this.#rangeMap.get(rangeKey).delete(entry)

      if (this.#rangeMap.get(rangeKey).size === 0) {
        this.#rangeMap.delete(rangeKey)
      }

      return this.#idMap.delete(key)
    }

    return false
  }

  clear() {
    this.#idMap.clear()
    this.#rangeMap.clear()
  }

  values() {
    return this.#idMap.values()
  }

  #getRangeKey(entry) {
    return entry.begin & entry.end
  }
}
