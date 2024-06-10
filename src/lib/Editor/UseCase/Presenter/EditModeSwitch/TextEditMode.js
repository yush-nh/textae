import delegate from 'delegate'
import EditMode from './EditMode'
import isRangeInTextBox from './isRangeInTextBox'
import hasCharacters from './hasCharacters'
import SelectionWrapper from './SelectionWrapper'
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
            const selection = window.getSelection()

            if (isRangeInTextBox(selection, e.target)) {
              const selectionWrapper = new SelectionWrapper(
                this.#annotationModel.span
              )
              if (
                hasCharacters(
                  this.#annotationModel.sourceDoc,
                  this.#spanConfig,
                  selectionWrapper
                )
              ) {
                const { begin, end } = getNewSpan(
                  this.#annotationModel.sourceDoc,
                  this.#spanAdjuster,
                  selectionWrapper,
                  this.#spanConfig
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
