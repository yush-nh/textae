import forwardMethods from '../../../../forwardMethods'
import PropertyEditor from './PropertyEditor'
import bindPalletEvents from './bindPalletEvents'

export default class EditMode {
  #attributeEditor
  #menuState
  #pallet
  #editProperties

  constructor(
    editorHTMLElement,
    annotationModel,
    selectionModel,
    commander,
    menuState,
    attributeEditor,
    getAutocompletionWs,
    definitionContainer,
    annotationType,
    mousePoint,
    pallet = null
  ) {
    this.#attributeEditor = attributeEditor
    this.#menuState = menuState
    this.#editProperties = new PropertyEditor(
      editorHTMLElement,
      commander,
      pallet,
      mousePoint,
      definitionContainer,
      annotationModel,
      getAutocompletionWs
    )

    // protected fields referenced by the child classes
    this._selectionModel = selectionModel
    this._annotationModel = annotationModel
    this._getAutocompletionWs = getAutocompletionWs
    this._definitionContainer = definitionContainer

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

  // A protected method
  _updateButtonsToOperateSpanWithTouchDevice(
    enableToCreate,
    enableToExpand,
    enableToShrink
  ) {
    this.#menuState.updateButtonsToOperateSpanWithTouchDevice(
      enableToCreate,
      enableToExpand,
      enableToShrink
    )
  }

  // A protected method
  _editProperties(selectionModel, annotationType, palletName, mousePoint) {
    this.#editProperties.startEditing(
      selectionModel,
      annotationType,
      palletName,
      mousePoint
    )
  }
}
