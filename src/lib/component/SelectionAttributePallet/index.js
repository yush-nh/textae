import delegate from 'delegate'
import dohtml from 'dohtml'
import template from './template'
import Pallet from '../Pallet'

export default class SelectionAttributePallet extends Pallet {
  constructor(editor) {
    super(editor, 'entity', 'Please select value')

    this._veil = dohtml.create(
      `<div style="position: fixed; right: 0; top: 0; bottom:0; left: 0; background-color: rgba(0, 0, 10, 0.3);"></div>`
    )
  }

  show(attrDef, zIndex, opener) {
    this._editor[0].appendChild(this._veil)
    this._editor[0].appendChild(this.el)
    this._veil.style['z-index'] = zIndex + 1
    this._el.style['z-index'] = zIndex + 1
    this._attributeDefinition = attrDef
    super.show()

    // Close the SelectionAttributePallet with the Esc key.
    this._opener = opener
    this._el.querySelector('.textae-editor__type-pallet__close-button').focus()
    this._el.addEventListener('keydown', (event) => {
      if (event.code === 'Escape') {
        event.preventDefault()
        this.hide()
      }
    })

    return new Promise((resolve) => {
      delegate(
        this._el,
        '.textae-editor__type-pallet__selection-attribute-label',
        'click',
        (e) => {
          this.hide()
          resolve(e.target.dataset.id)
        }
      )
    })
  }

  hide() {
    this._editor[0].removeChild(this._veil)
    this._editor[0].removeChild(this.el)

    // Focus on the button used to open the palette
    // so that the Entity Edit dialog can be closed with the Esc key.
    this._opener.focus()
  }

  get _content() {
    const values = {
      attrDef: this._attributeDefinition.JSON
    }
    return template(values)
  }
}
