import delegate from 'delegate'
import EditMode from './EditMode'
import isRangeInTextBox from './isRangeInTextBox'

export default class TextEditMode extends EditMode {
  #editorHTMLElement
  #annotationModel
  #spanConfig
  menuState

  constructor(editorHTMLElement, annotationModel, spanConfig, menuState) {
    super()
    this.#editorHTMLElement = editorHTMLElement
    this.#annotationModel = annotationModel
    this.#spanConfig = spanConfig
    this.menuState = menuState
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
                const { begin, end } = this.#annotationModel.getNewSpan(
                  this.#spanConfig,
                  this.menuState.spanAdjuster
                )
                const targetText = this.#annotationModel.sourceDoc.substring(
                  begin,
                  end
                )
                console.log('selection', selection, begin, end, targetText)
              }
            }
          }
        }
      )
    )

    return listeners
  }
}
