import forwardMethods from '../../../../forwardMethods'
import bindPalletEvents from './bindPalletEvents'

export default class EditMode {
  #attributeEditor
  #pallet

  constructor(
    editorHTMLElement,
    annotationModel,
    selectionModel,
    commander,
    attributeEditor,
    getAutocompletionWs,
    definitionContainer,
    annotationType,
    pallet = null
  ) {
    this.#attributeEditor = attributeEditor

    if (pallet) {
      this.#pallet = pallet

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
  }

  hidePallet() {
    if (!this.#pallet) return

    this.#pallet.hide()
  }

  get isPalletShown() {
    if (!this.#pallet) return false

    return this.#pallet.visibility
  }

  // Dummy functions
  createSpanWithTouchDevice() {}
  expandSpanWithTouchDevice() {}
  shrinkSpanWithTouchDevice() {}
  editProperties() {}
  relationClicked() {}
  relationBollardClicked() {}
  applyTextSelectionWithTouchDevice() {}

  manipulateAttribute(number, shiftKey) {
    if (shiftKey) {
      this.#attributeEditor.deleteAt(number)
    } else {
      this.#attributeEditor.addOrEditAt(number)
    }
  }
}
