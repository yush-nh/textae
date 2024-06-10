import delegate from 'delegate'
import EditMode from './EditMode'

export default class TextEditMode extends EditMode {
  #editorHTMLElement

  constructor(editorHTMLElement) {
    super()
    this.#editorHTMLElement = editorHTMLElement
  }

  bindMouseEvents() {
    const listeners = []

    listeners.push(
      delegate(
        this.#editorHTMLElement,
        '.textae-editor__text-box',
        'click',
        (e) => {
          if (e.target.classList.contains('textae-editor__text-box')) {
            const selection = window.getSelection()
            console.log('selection', selection)
          }
        }
      )
    )

    return listeners
  }
}
