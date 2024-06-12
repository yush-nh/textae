export default class SelectedItems {
  #emitter
  #annotationType
  #instanceContainer

  constructor(emitter, annotationType, annotationModel) {
    this.#emitter = emitter
    this.#annotationType = annotationType
    this.#instanceContainer = annotationModel[annotationType]
  }

  add(id) {
    const instance = this.#instanceContainer.get(id)

    console.assert(
      instance,
      `${id} is not a instance of ${this.#annotationType}.`
    )

    if (instance.isSelected) {
      return
    }

    instance.select()
    this.triggerChange()
  }

  has(id) {
    const instance = this.#instanceContainer.get(id)

    if (instance) {
      return instance.isSelected
    }

    return false
  }

  contains(predicate) {
    for (const v of this.#instanceContainer.selectedItems) {
      if (predicate(v)) {
        return true
      }
    }

    return false
  }

  get all() {
    return this.#instanceContainer.selectedItems
  }

  get size() {
    return this.#instanceContainer.selectedItems.length
  }

  get some() {
    return this.size > 0
  }

  get singleId() {
    const instance = this.single
    if (instance) {
      return instance.id
    }

    return null
  }

  get single() {
    return this.size === 1 ? this.#instanceContainer.selectedItems[0] : null
  }

  toggle(id) {
    if (this.has(id)) {
      this.remove(id)
    } else {
      this.add(id)
    }
  }

  remove(id) {
    if (this.has(id)) {
      this.#instanceContainer.get(id).deselect()
      this.triggerChange()
    }
  }

  removeInstance(instance) {
    this.remove(instance.id)
  }

  removeAll() {
    if (this.size === 0) return

    for (const instance of this.all) {
      instance.deselect()
    }

    this.triggerChange()
  }

  triggerChange() {
    this.#emitter.emit(`textae-event.selection.${this.#annotationType}.change`)
  }
}
