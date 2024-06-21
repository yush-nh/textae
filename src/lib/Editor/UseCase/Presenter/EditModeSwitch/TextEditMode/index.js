import delegate from 'delegate'
import EditMode from '../EditMode'
import isTextSelectionInTextBox from '../isTextSelectionInTextBox'
import TextEditDialog from './TextEditDialog'

export default class TextEditMode extends EditMode {
  #editorHTMLElement
  #annotationModel
  #spanConfig
  #menuState
  #commander
  #dialog

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
    this.#dialog = new TextEditDialog(editorHTMLElement, (begin, end, text) => {
      const command = this.#commander.factory.changeTextAndMoveSpanCommand(
        begin,
        end,
        text
      )
      this.#commander.invoke(command)
    })
  }

  bindMouseEvents() {
    const listeners = []

    listeners.push(
      delegate(
        this.#editorHTMLElement,
        '.textae-editor__text-box',
        'click',
        (event) => this.#handleTexSelection(event)
      )
    )

    return listeners
  }

  #handleTexSelection(event) {
    if (event.target.classList.contains('textae-editor__text-box')) {
      const textBox = event.target
      const selection = window.getSelection()

      if (!isTextSelectionInTextBox(textBox)) {
        return
      }

      if (!this.#annotationModel.hasCharacters(this.#spanConfig)) {
        return
      }

      const { begin, end } = this.#annotationModel.getTextSelection(
        this.#spanConfig,
        this.#menuState.textSelectionAdjuster
      )

      if (this.#annotationModel.validateEditableText(begin, end)) {
        const targetText = this.#annotationModel.getTextBetween(begin, end)
        this.#dialog.open(begin, end, targetText)
      }
    }
  }
}
