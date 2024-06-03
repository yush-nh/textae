export default class IconEventMap {
  constructor(
    commander,
    presenter,
    persistenceInterface,
    menuState,
    annotationModel
  ) {
    this._map = new Map([
      ['view mode', () => presenter.toViewMode()],
      ['term edit mode', () => presenter.toEditTermMode()],
      ['block edit mode', () => presenter.toEditBlockMode()],
      ['relation edit mode', () => presenter.toRelationMode()],
      ['simple view', () => presenter.toggleSimpleMode()],
      ['import', () => persistenceInterface.importAnnotation()],
      ['upload', () => persistenceInterface.uploadAnnotation()],
      ['undo', () => commander.undo()],
      ['redo', () => commander.redo()],
      ['replicate span annotation', () => presenter.replicate()],
      ['create span by touch', () => presenter.createSpanWithTouchDevice()],
      ['expand span by touch', () => presenter.expandSpanWithTouchDevice()],
      ['shrink span by touch', () => presenter.shrinkSpanWithTouchDevice()],
      ['new entity', () => presenter.createEntity()],
      ['edit properties', () => presenter.editProperties()],
      ['pallet', () => presenter.showPallet()],
      ['delete', () => presenter.removeSelectedElements()],
      ['copy', () => presenter.copyEntitiesToLocalClipboard()],
      ['cut', () => presenter.cutEntitiesToLocalClipboard()],
      ['paste', () => presenter.pasteEntitiesFromLocalClipboard()],
      ['setting', () => presenter.showSettingDialog()],
      ['adjust lineheight', () => annotationModel.textBox.updateLineHeight()]
    ])

    // Set handler for push buttons.
    for (const buttonName of menuState.pushButtonNames) {
      if (!this._map.has(buttonName)) {
        this._map.set(buttonName, () => presenter.toggleButton(buttonName))
      }
    }
  }

  handle(key) {
    if (this._map.has(key)) {
      this._map.get(key)()
    }
  }
}
