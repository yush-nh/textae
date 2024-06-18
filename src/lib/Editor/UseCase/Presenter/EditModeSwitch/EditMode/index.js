import forwardMethods from '../../../../forwardMethods'

export default class EditMode {
  #pallet

  constructor(
    editorHTMLElement,
    annotationModel,
    selectionModel,
    commander,
    getAutocompletionWs,
    definitionContainer,
    annotationType,
    pallet = null
  ) {
    if (pallet) {
      pallet.appendTo(editorHTMLElement)

      forwardMethods(this, () => pallet, [
        'showPallet',
        'selectLeftAttributeTab',
        'selectRightAttributeTab'
      ])

      this.#pallet = pallet
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
  manipulateAttribute() {}
}
