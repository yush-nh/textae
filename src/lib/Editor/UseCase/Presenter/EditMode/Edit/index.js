import EditPropertiesDialog from '../../../../../component/EditPropertiesDialog'
import forwardMethods from '../../../../forwardMethods'
import bindPalletEvents from './bindPalletEvents'

export default class Edit {
  #editorHTMLElement
  #pallet
  #commander
  #attributeEditor
  #menuState

  constructor(
    editorHTMLElement,
    annotationModel,
    selectionModel,
    commander,
    menuState,
    pallet,
    attributeEditor,
    getAutocompletionWs,
    definitionContainer,
    annotationType
  ) {
    this.#editorHTMLElement = editorHTMLElement
    this.#pallet = pallet
    this.#commander = commander
    this.#attributeEditor = attributeEditor
    this.#menuState = menuState

    // protected fields referenced by the child classes
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
  createSpanWithTouchDevice() {}
  expandSpanWithTouchDevice() {}
  shrinkSpanWithTouchDevice() {}
  relationClicked() {}
  relationBollardClicked() {}

  applyTextSelectionWithTouchDevice() {
    this._updateButtonsToOperateSpanWithTouchDevice(false, false, false)
  }

  manipulateAttribute(number, shiftKey) {
    if (shiftKey) {
      this.#attributeEditor.deleteAt(number)
    } else {
      this.#attributeEditor.addOrEditAt(number)
    }
  }

  // A protected method
  _bindMouseEvents(bindMethod, mouseEventHandler) {
    return bindMethod(this.#editorHTMLElement, mouseEventHandler)
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
  _editProperties(annotationType, palletName, selectedItems, mousePoint) {
    this.#createEditPropertiesDialog(
      annotationType,
      palletName,
      selectedItems,
      mousePoint
    )
      .open()
      .then((values) => this.#typeValuesChanged(values))
  }

  #typeValuesChanged({ typeName, label, attributes = [] }) {
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

  #createEditPropertiesDialog(
    annotationType,
    palletName,
    selectedItems,
    mousePoint
  ) {
    return new EditPropertiesDialog(
      this.#editorHTMLElement,
      annotationType,
      palletName,
      this._definitionContainer,
      this._annotationModel.typeDefinition.attribute,
      this._getAutocompletionWs(),
      selectedItems,
      this.#pallet,
      mousePoint
    )
  }
}
