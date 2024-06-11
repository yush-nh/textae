import delegate from 'delegate'
import EditMode from './EditMode'
import isRangeInTextBox from './isRangeInTextBox'
import hasCharacters from './hasCharacters'
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
              const { sourceDoc, span } = this.#annotationModel
              if (hasCharacters(sourceDoc, span, this.#spanConfig)) {
                const { begin, end } = getNewSpan(
                  sourceDoc,
                  span,
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
