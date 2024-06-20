import delegate from 'delegate'
import EditMode from './EditMode'
import isRangeInTextBox from './isRangeInTextBox'

export default class TextEditMode extends EditMode {
  #editorHTMLElement
  #annotationModel
  #spanConfig
  #menuState
  #commander

  constructor(
    editorHTMLElement,
    annotationModel,
    spanConfig,
    menuState,
    commander
  ) {
    super()
    this.#editorHTMLElement = editorHTMLElement
    this.#annotationModel = annotationModel
    this.#spanConfig = spanConfig
    this.#menuState = menuState
    this.#commander = commander
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
                const { begin, end } = this.#annotationModel.getTextSelection(
                  this.#spanConfig,
                  this.#menuState.textSelectionAdjuster
                )
                const targetText = this.#annotationModel.getTextBetween(
                  begin,
                  end
                )
                alert(`selection: ${targetText}`)

                const command =
                  this.#commander.factory.changeTextAndMoveSpanCommand(
                    begin,
                    end,
                    'foo bar baz'
                  )
                this.#commander.invoke(command)
              }
            }
          }
        }
      )
    )

    return listeners
  }
}
