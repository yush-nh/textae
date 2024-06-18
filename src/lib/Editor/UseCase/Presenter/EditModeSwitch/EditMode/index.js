import forwardMethods from '../../../../forwardMethods'
import PalletWrapper from '../PalletWrapper'

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
      const palletWrapper = new PalletWrapper(
        pallet,
        commander,
        getAutocompletionWs,
        definitionContainer,
        annotationType,
        selectionModel,
        annotationModel
      )
      palletWrapper.appendTo(editorHTMLElement)

      forwardMethods(this, () => palletWrapper, [
        'showPallet',
        'selectLeftAttributeTab',
        'selectRightAttributeTab'
      ])

      this.#pallet = palletWrapper
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
