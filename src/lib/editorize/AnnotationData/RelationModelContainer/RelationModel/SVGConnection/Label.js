import dohtml from 'dohtml'
import SignboardHTMLElement from '../../../../SignboardHTMLElement'

export default class Label {
  constructor(container, relation, arrow, onClick, onMouseEnter, onMouseLeave) {
    this._container = container
    this._relation = relation
    this._arrow = arrow

    this._location = dohtml.create(
      `<div class="textae-editor__relation__signboard-location"></div>`
    )
    this._signboard = new SignboardHTMLElement(relation, 'relation', null)
    this._location.appendChild(this._signboard.element)
    this._container.appendChild(this._location)

    this._location.addEventListener('click', onClick)
    this._location.addEventListener('mouseenter', onMouseEnter)
    this._location.addEventListener('mouseleave', onMouseLeave)

    this._updatePosition(this._arrow.x, this._arrow.y, this._arrow.width)
  }

  updateAppearanceState(x, y, width, isHovered) {
    this._updatePosition(x, y, width)
    this._signboard.CSSClass = this._relation.isSelected
      ? 'textae-editor__signboard--selected'
      : isHovered
      ? 'textae-editor__signboard--hovered'
      : null
  }

  updateValue(x, y, width) {
    this._updatePosition(x, y, width)
    this._signboard.updateLabel()
  }

  updatePosition(x, y, width) {
    this._updatePosition(x, y, width)
  }

  destructor() {
    this._container.removeChild(this._location)
  }

  get y() {
    return this._background.getBBox().y
  }

  get width() {
    return this._location.getBBox().width
  }

  get height() {
    return this._location.getBBox().height
  }

  _updatePosition(x, y, width) {
    this._location.style.width = `${width}px`
    this._location.style.top = `${
      y - 18 - this._relation.attributes.length * 18
    }px`
    this._location.style.left = `${x}px`
  }
}
