import EditPropertiesDialog from '../../../../../component/EditPropertiesDialog'

export default class PropertyEditor {
  #editorHTMLElement
  #commander
  #pallet
  #mousePoint
  #definitionContainer
  #annotationModel
  #getAutocompletionWs

  constructor(
    editorHTMLElement,
    commander,
    pallet,
    mousePoint,
    definitionContainer,
    annotationModel,
    getAutocompletionWs
  ) {
    this.#editorHTMLElement = editorHTMLElement
    this.#commander = commander
    this.#pallet = pallet
    this.#mousePoint = mousePoint
    this.#definitionContainer = definitionContainer
    this.#annotationModel = annotationModel
    this.#getAutocompletionWs = getAutocompletionWs
  }

  startEditing(selectionModel, annotationType, palletName, mousePoint) {
    if (selectionModel.some) {
      this.#createEditPropertiesDialog(
        annotationType,
        palletName,
        selectionModel.all,
        mousePoint
      )
        .open()
        .then((values) => this.#typeValuesChanged(values))
    }
  }

  #typeValuesChanged({ typeName, label, attributes = [] }) {
    const commands = this.#commander.factory.changeTypeValuesCommand(
      label,
      typeName,
      this.#definitionContainer,
      attributes
    )

    if (typeName) {
      this.#commander.invoke(commands)
    }
  }

  #createEditPropertiesDialog(annotationType, palletName, selectedItems) {
    return new EditPropertiesDialog(
      this.#editorHTMLElement,
      annotationType,
      palletName,
      this.#definitionContainer,
      this.#annotationModel.typeDefinition.attribute,
      this.#getAutocompletionWs(),
      selectedItems,
      this.#pallet,
      this.#mousePoint
    )
  }
}
