export default class InstanceContainer {
  #emitter
  #name

  constructor(emitter, name) {
    this.#emitter = emitter
    this.#name = name
    this._container = new Map()
  }

  // Protected method
  _toInstance(rowDatum) {
    return rowDatum
  }

  addSource(source, type) {
    for (const instance of source.map((r) => this._toInstance(r, type))) {
      this._addToContainer(instance)
    }
  }

  add(instance) {
    const newInstance = this._addToContainer(instance)
    this._emit(`textae-event.annotation-data.${this.#name}.add`, newInstance)
    return newInstance
  }

  get(id) {
    return this._container.get(id)
  }

  get all() {
    return Array.from(this._container.values())
  }

  get selectedItems() {
    return this.all.filter(({ isSelected }) => isSelected)
  }

  findByType(typeName) {
    return this.all.filter((instance) => instance.typeName === typeName)
  }

  /**
   * @returns {boolean} true if the container has any instance.
   * @readonly
   */
  get some() {
    return !!this._container.size
  }

  changeType(id, newType) {
    const instance = this._container.get(id)
    instance.typeName = newType
    this._emit(`textae-event.annotation-data.${this.#name}.change`, instance)
    return instance
  }

  remove(id) {
    const instance = this._container.get(id)
    if (instance) {
      this._container.delete(id)
      this._emit(`textae-event.annotation-data.${this.#name}.remove`, instance)
    }
    return instance
  }

  clear() {
    this._container.clear()
  }

  _addToContainer(instance) {
    this._container.set(instance.id, instance)
    return instance
  }

  _emit(event, data) {
    this.#emitter.emit(event, data)
  }
}
