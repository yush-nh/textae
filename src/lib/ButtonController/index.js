import PushButtons from './PushButtons'
import EnableState from './EnableState'
import setPushButtonsForMode from './setPushButtonsForMode'

export default class {
  constructor(editor, annotationData, selectionModel, clipBoard) {
    this._enableState = new EnableState(editor, selectionModel, clipBoard)
    // Save state of push control buttons.
    this._pushButtons = new PushButtons(editor, annotationData)
  }

  propagate() {
    this._enableState.propagate()
    this._pushButtons.propagate()
  }

  get pushButtons() {
    return this._pushButtons
  }

  setPushButtonsForMode(mode, editable) {
    setPushButtonsForMode(this._pushButtons, mode, editable)
  }
}
