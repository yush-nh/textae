import delegate from 'delegate'
import EditMode from './EditMode'
import isRangeInTextBox from './isRangeInTextBox'
import getNewSpan from './getNewSpan'

export default class TextEditMode extends EditMode {
  #editorHTMLElement
  #annotationModel
  #spanConfig
  #spanAdjuster

  constructor(editorHTMLElement, annotationModel, spanConfig, spanAdjuster) {
    super()
    this.#editorHTMLElement = editorHTMLElement
    this.#annotationModel = annotationModel
    this.#spanConfig = spanConfig
    this.#spanAdjuster = spanAdjuster
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
            const textBox = e.target
            const selection = window.getSelection()

            if (isRangeInTextBox(selection, textBox)) {
              if (this.#annotationModel.hasCharacters(this.#spanConfig)) {
                const { begin, end } = getNewSpan(
                  this.#annotationModel,
                  this.#spanConfig,
                  this.#spanAdjuster
                )
                console.log('selection', selection, begin, end)
              }
            }
          }
        }
      )
    )

    return listeners
  }
}
