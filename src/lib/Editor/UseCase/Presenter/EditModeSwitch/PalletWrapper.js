import forwardMethods from '../../../forwardMethods'
import bindPalletEvents from './EditMode/bindPalletEvents'
import TypeValuesPallet from '../../../../component/TypeValuesPallet'

export default class PalletWrapper {
  #pallet

  constructor(
    editorHTMLElement,
    eventEmitter,
    typeDictionary,
    attributeInstanceContainer,
    definitionContainer,
    selectionModelEntity,
    commander,
    title,
    menuState,
    mousePoint,
    getAutocompletionWs,
    annotationType,
    selectionModel,
    annotationModel
  ) {
    this.#pallet = new TypeValuesPallet(
      editorHTMLElement,
      eventEmitter,
      typeDictionary,
      attributeInstanceContainer,
      definitionContainer,
      selectionModelEntity,
      commander,
      title,
      menuState,
      mousePoint
    )

    bindPalletEvents(
      this.#pallet,
      commander,
      getAutocompletionWs,
      definitionContainer,
      annotationType,
      selectionModel,
      annotationModel
    )

    forwardMethods(this, () => this.#pallet, [
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
