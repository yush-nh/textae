import forwardMethods from '../../../forwardMethods'
import bindPalletEvents from './EditMode/bindPalletEvents'
import TypeValuesPallet from '../../../../component/TypeValuesPallet'

export default class PalletWrapper {
  static create(
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
    annotationModel,
    delegator
  ) {
    const pallet = new TypeValuesPallet(
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
      pallet,
      commander,
      getAutocompletionWs,
      definitionContainer,
      annotationType,
      selectionModel,
      annotationModel
    )

    forwardMethods(delegator, () => pallet, [
      'showPallet',
      'hidePallet',
      'selectLeftAttributeTab',
      'selectRightAttributeTab'
    ])

    this.#appendTo(editorHTMLElement, pallet)

    return pallet
  }

  static #appendTo(editorHTMLElement, pallet) {
    editorHTMLElement.appendChild(pallet.el)
  }
}
