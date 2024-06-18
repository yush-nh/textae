import forwardMethods from '../../../forwardMethods'
import bindPalletEvents from './EditMode/bindPalletEvents'

export default class PalletWrapper {
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
      'selectRightAttributeTab'
    ])
  }

  hidePallet() {
    this.#pallet.hide()
  }

  appendTo(editorHTMLElement) {
    editorHTMLElement.appendChild(this.#pallet.el)
  }

  get pallet() {
    return this.#pallet
  }
}
