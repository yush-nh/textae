import getLineHeight from './getLineHeight'
import setLineHeight from './setLineHeight'
import updateTextBoxHeight from './updateTextBoxHeight'
import pixelToInt from './pixelToInt'

export default class TextBox {
  constructor(el, annotationData) {
    this._el = el
    this._annotationData = annotationData
  }

  get boundingClientRect() {
    return this._el.getBoundingClientRect()
  }

  get lineHeight() {
    return getLineHeight(this._el)
  }

  set lineHeight(val) {
    setLineHeight(this._el, val)
    updateTextBoxHeight(this._el)
  }

  render(text) {
    this._el.innerHTML = text
  }

  updateLineHeight() {
    if (this._annotationData.span.allDenotationSpans.length) {
      this.lineHeight = this._annotationData.span.maxHeight
    } else {
      this._resetLineHeight()
    }
  }

  _resetLineHeight() {
    // The default line height follows the editor's line height.
    const { lineHeight } = window.getComputedStyle(
      this._el.closest('.textae-editor')
    )
    this.lineHeight = pixelToInt(lineHeight)
  }

  forceUpdate() {
    updateTextBoxHeight(this._el)
  }
}
