export default class {
  constructor(editor, textBox) {
    this._textBox = textBox
    this._enable = false

    editor.eventEmitter.on(
      'textae.control.button.push',
      ({ buttonName, state }) => {
        if (buttonName === 'line-height-auto') {
          this._enable = state
        }
      }
    )
  }

  updateLineHeight(gridHeight) {
    if (this._enable) {
      this._textBox.updateLineHeight(gridHeight)
    }
  }
}
