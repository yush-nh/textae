import forwardMethods from '../../../../forwardMethods'
import bindPalletEvents from './bindPalletEvents'

class PalletWrapper {
  #pallet

  constructor(
    pallet,
    commander,
    getAutocompletionWs,
    definitionContainer,
    annotationType,
    selectionModel,
    annotationModel
  ) {
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

    forwardMethods(this, () => pallet, [
      'showPallet',
      'selectLeftAttributeTab',
      'selectRightAttributeTab',
      'hide',
      'visibility'
    ])
  }

  appendTo(editorHTMLElement) {
    editorHTMLElement.appendChild(this.#pallet.el)
  }
}

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
