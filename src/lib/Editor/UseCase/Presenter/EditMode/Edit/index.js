import forwardMethods from '../../../../forwardMethods'
import bindPalletEvents from './bindPalletEvents'

export default class Edit {
  #pallet
  #commander
  #attributeEditor

  constructor(
    editorHTMLElement,
    selectionModel,
    annotationModel,
    pallet,
    commander,
    attributeEditor,
    getAutocompletionWs,
    definitionContainer,
    menuState,
    annotationType
  ) {
    this.#pallet = pallet
    this.#commander = commander
    this.#attributeEditor = attributeEditor

    // protected fields referenced by the child classes
    this._editorHTMLElement = editorHTMLElement
    this._selectionModel = selectionModel
    this._annotationModel = annotationModel
    this._getAutocompletionWs = getAutocompletionWs
    this._definitionContainer = definitionContainer
    this._menuState = menuState

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
  createSpanWithTouchDevice() {}
  expandSpanWithTouchDevice() {}
  shrinkSpanWithTouchDevice() {}
  relationClicked() {}
  relationBollardClicked() {}

  applyTextSelectionWithTouchDevice() {
    this._menuState.updateButtonsToOperateSpanWithTouchDevice(
      false,
      false,
      false
    )
  }

  manipulateAttribute(number, shiftKey) {
    if (shiftKey) {
      this.#attributeEditor.deleteAt(number)
    } else {
      this.#attributeEditor.addOrEditAt(number)
    }
  }

  // A protected method
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
