import forwardMethods from '../../../../forwardMethods'
import bindPalletEvents from './bindPalletEvents'

export default class Edit {
  #pallet
  #commander

  constructor(
    editorHTMLElement,
    selectionModel,
    annotationModel,
    pallet,
    commander,
    getAutocompletionWs,
    definitionContainer,
    annotationType
  ) {
    this.#pallet = pallet
    this.#commander = commander

    // protected fields referenced by the child classes
    this._editorHTMLElement = editorHTMLElement
    this._selectionModel = selectionModel
    this._annotationModel = annotationModel
    this._getAutocompletionWs = getAutocompletionWs
    this._definitionContainer = definitionContainer

    bindPalletEvents(
      pallet,
      commander,
      getAutocompletionWs,
      definitionContainer,
      annotationType,
      selectionModel,
      annotationModel
    )

    editorHTMLElement.appendChild(pallet.el)

    forwardMethods(this, () => pallet, [
      'showPallet',
      'selectLeftAttributeTab',
      'selectRightAttributeTab'
    ])
  }

  get pallet() {
    return this.#pallet
  }

  // Dummy functions
  createSpan() {}
  expandSpan() {}
  shrinkSpan() {}
  relationClicked() {}
  relationBollardClicked() {}

  manipulateAttribute(number, shiftKey) {
    if (shiftKey) {
      this._attributeEditor.deleteAt(number)
    } else {
      this._attributeEditor.addOrEditAt(number)
    }
  }

  _typeValuesChanged({ typeName, label, attributes = [] }) {
    const commands = this.#commander.factory.changeTypeValuesCommand(
      label,
      typeName,
      this._definitionContainer,
      attributes
    )

    if (typeName) {
      this.#commander.invoke(commands)
    }
  }
}
