export default class CollectionMap {
  constructor() {
    this.map = new Map()
  }

  set(key, value) {
    if (!this.map.has(key)) {
      this.map.set(key, new Set())
    }
    this.map.get(key).add(value)
    return this // To allow chaining like Map
  }

  get(key) {
    const collection = this.map.get(key)
    if (collection) {
      return collection.values().next().value
    }

    return null
  }

  getCollection(key) {
    return this.map.get(key) || new Set()
  }

  has(key) {
    return this.map.has(key)
  }

  delete(key) {
    return this.map.delete(key)
  }

  clear() {
    this.map.clear()
  }

  values() {
    return Array.from(this.map.values()).flatMap((set) => Array.from(set))
  }
}
