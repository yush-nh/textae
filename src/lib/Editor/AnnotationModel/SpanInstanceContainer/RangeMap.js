export default class CollectionMap {
  #idMap = new Map()
  #rangeMap = new Map()

  constructor() {}

  set(key, value) {
    this.#idMap.set(key, value)

    const rangeKey = value.begin & value.end
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

    const rangeKey = entry.begin & entry.end
    return this.#rangeMap.get(rangeKey)
  }

  has(key) {
    return this.#idMap.has(key)
  }

  delete(key) {
    const entry = this.#idMap.get(key)

    if (entry) {
      const rangeKey = entry.begin & entry.end
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
}
