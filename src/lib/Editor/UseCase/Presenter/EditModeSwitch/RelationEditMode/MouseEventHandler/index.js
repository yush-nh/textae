import bindMouseEvents from '../bindMouseEvents'
import typeValuesClicked from './typeValuesClicked'

export default class MouseEventHandler {
  #editorHTMLElement
  #selectionModel
  #commander
  #typeDefinition
  #pallet

  constructor(
    editorHTMLElement,
    selectionModel,
    commander,
    typeDefinition,
    pallet
  ) {
    this.#editorHTMLElement = editorHTMLElement
    this.#selectionModel = selectionModel
    this.#commander = commander
    this.#typeDefinition = typeDefinition
    this.#pallet = pallet
  }

  bind() {
    return bindMouseEvents(this.#editorHTMLElement, this)
  }

  bodyClicked() {
    this.#pallet.hide()
    this.#selectionModel.removeAll()
  }

  signboardClicked() {
    this.#editorHTMLElement.focus()
  }

  typeValuesClicked(event, entityID) {
    typeValuesClicked(
      this.#selectionModel,
      this.#commander,
      this.#typeDefinition.relation,
      event,
      entityID
    )
  }
}
