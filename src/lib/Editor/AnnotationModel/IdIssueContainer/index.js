import InstanceContainer from '../InstanceContainer'

export default class IdIssueContainer extends InstanceContainer {
  #prefixFunc

  constructor(emitter, name, prefixFunc) {
    super(emitter, name)

    this.#prefixFunc = prefixFunc
  }

  addSource(source, type) {
    const collection = source.map((r) => this._toInstance(r, type))

    // Move instances without id behind others, to prevent id duplication generated and exists.
    collection.sort((a, b) => {
      if (!a.id) return 1
      if (!b.id) return -1
      if (a.id < b.id) return -1
      if (a.id > b.id) return 1

      return 0
    })

    for (const instance of collection) {
      super._addToContainer(this.#assignID(instance))
    }
  }

  add(instance) {
    return super.add(this.#assignID(instance))
  }

  #assignID(instance) {
    if (!instance.id) {
      instance.id = this.#generateNextID(instance)
    }

    return instance
  }

  #generateNextID(instance) {
    const prefix = this.#prefixFunc(instance)

    const wellFormattedIDs = new Set()
    for (const id of super._container.keys()) {
      // The format of id is a prefix and a number, for example 'T1'.
      if (new RegExp(`^${prefix}\\d+$`).test(id)) {
        wellFormattedIDs.add(id.slice(1))
      }
    }

    // The Math.max return -Infinity when the second argument array is empty.
    if (wellFormattedIDs.size === 0) {
      return `${prefix}1`
    }

    const max = Math.max(...wellFormattedIDs.values())
    return `${prefix}${max + 1}`
  }
}
