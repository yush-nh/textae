import handle from './handle'
import KeyEventMap from './KeyEventMap'
import IconApiMap from './IconApiMap'

export default class InstanceMethods {
  constructor(
    commander,
    presenter,
    persistenceInterface,
    buttonController,
    view
  ) {
    this._keyEventMap = new KeyEventMap(
      commander,
      presenter,
      persistenceInterface
    )
    this._iconEventMap = new IconApiMap(
      commander,
      presenter,
      persistenceInterface,
      view,
      buttonController
    )
    this._view = view
    this._buttonController = buttonController
    this._presenter = presenter
    this._isActive = false
  }

  handleKeyInput(event) {
    // Keyup events occurs without selected editor, When editor is focused before initializing.
    if (this._isActive) {
      // The value of the key property when pressing a key while holding down the Shift key depends on the keyboard layout.
      // For example, on a US keyboard, the shift + 1 keystroke is “!”.
      // When shift and number key are pressed, the input value is taken from the keyCode property.
      const key =
        event.shiftKey && 48 <= event.keyCode && event.keyCode <= 57
          ? String.fromCharCode(event.keyCode)
          : event.key

      handle(this._keyEventMap, key, event.shiftKey)
    }
  }

  handleButtonClick(key) {
    handle(this._iconEventMap, key, {})
  }

  redraw() {
    this._view.updateDisplay()
  }

  active() {
    this._presenter.active()
    this._isActive = true
  }

  deactive() {
    this._presenter.deactive()
    this._isActive = false
  }

  applyTextSelection() {
    if (this._isActive) {
      this._buttonController.applyTextSelection()
    }
  }
}
