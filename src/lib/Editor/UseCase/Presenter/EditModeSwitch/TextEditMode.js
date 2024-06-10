import delegate from 'delegate'
import EditMode from './EditMode'
import isRangeInTextBox from './isRangeInTextBox'
import hasCharacters from './hasCharacters'
import SelectionWrapper from './SelectionWrapper'

export default class TextEditMode extends EditMode {
  #editorHTMLElement
  #annotationModel
  #spanConfig

  constructor(editorHTMLElement, annotationModel, spanConfig) {
    super()
    this.#editorHTMLElement = editorHTMLElement
    this.#annotationModel = annotationModel
    this.#spanConfig = spanConfig
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
                console.log('selection', selection)
              }
            }
          }
        }
      )
    )

    return listeners
  }
}
