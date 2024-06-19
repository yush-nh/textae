import SpanInstance from './SpanInstance'

export default class StyleSpanInstance extends SpanInstance {
  constructor(
    editorID,
    editorHTMLElement,
    begin,
    end,
    spanInstanceContainer,
    style
  ) {
    super(editorID, editorHTMLElement, begin, end, spanInstanceContainer, style)
    this.styles = new Set([style])
  }

  // Mark it not to be rendered as a span.
  get styleOnly() {
    return true
  }

  appendStyles(styles) {
    this.styles = new Set([...this.styles, ...styles])
  }

  get _contentHTML() {
    return `
      <span
        id="${this.id}"
        title="${this.title}"
        class="${this._styleClasses.join(' ')}"
        >
      </span>
    `
  }
}
