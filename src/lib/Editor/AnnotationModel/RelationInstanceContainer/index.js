import RelationInstance from './RelationInstance'
import IdIssueContainer from '../IdIssueContainer'

export default class RelationInstanceContainer extends IdIssueContainer {
  #editorHTMLElement
  #eventEmitter
  #parentContainer
  #namespace
  #definitionContainer
  #toolBarHeight

  constructor(
    editorHTMLElement,
    eventEmitter,
    parentContainer,
    namespace,
    definitionContainer
  ) {
    super(eventEmitter, 'relation', () => 'R')
    this.#editorHTMLElement = editorHTMLElement
    this.#eventEmitter = eventEmitter
    this.#parentContainer = parentContainer
    this.#namespace = namespace
    this.#definitionContainer = definitionContainer
  }

  /** @param {number} value */
  set toolBarHeight(value) {
    this.#toolBarHeight = value
  }

  _toInstance(relation) {
    return new RelationInstance(
      this.#editorHTMLElement,
      this.#eventEmitter,
      this.#parentContainer.entity,
      this.#parentContainer.attributeInstanceContainer,
      relation,
      this.#namespace,
      this.#definitionContainer,
      this.#toolBarHeight
    )
  }

  add(newValue) {
    // When redoing, the newValue is instance of the RelationInstance already.
    newValue =
      newValue instanceof RelationInstance
        ? newValue
        : new RelationInstance(
            this.#editorHTMLElement,
            this.#eventEmitter,
            this.#parentContainer.entity,
            this.#parentContainer.attribute,
            newValue,
            this.#namespace,
            this.#definitionContainer,
            this.#toolBarHeight
          )
    const newInstance = super.add(newValue)

    const { clientHeight, clientWidth } = document.documentElement
    newInstance.render(clientHeight, clientWidth)

    return newInstance
  }

  changeType(id, newType) {
    const relation = super.changeType(id, newType)
    relation.updateElement()
    return relation
  }

  remove(id) {
    console.assert(id, 'id is necessary!')
    const relation = super.remove(id)
    relation.erase()
  }

  clear() {
    for (const relation of this.all) {
      relation.erase()
    }
    super.clear()
  }
}
