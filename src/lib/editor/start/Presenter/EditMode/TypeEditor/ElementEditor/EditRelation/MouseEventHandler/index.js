import clickEntity from './clickEntity'
import getEntityHtmlelementFromChild from '../../../../../../getEntityHtmlelementFromChild'

export default class MouseEventHandler {
  constructor(editor, selectionModel, commander, typeDefinition, pallet) {
    this._editor = editor
    this._selectionModel = selectionModel
    this._commander = commander
    this._typeDefinition = typeDefinition
    this._pallet = pallet
  }

  bodyClicked() {
    this._pallet.hide()
    this._selectionModel.clear()
  }

  textBoxClicked() {
    this._pallet.hide()
    this._selectionModel.clear()
  }

  endpointClicked(e) {
    const entity = getEntityHtmlelementFromChild(e.target).title
    clickEntity(
      this._selectionModel,
      entity,
      this._commander,
      this._typeDefinition,
      e
    )
  }

  entityClicked() {
    this._editor.focus()
  }

  typeValuesClicked(e) {
    const entity = getEntityHtmlelementFromChild(e.target).title
    clickEntity(
      this._selectionModel,
      entity,
      this._commander,
      this._typeDefinition,
      e
    )
  }
}
