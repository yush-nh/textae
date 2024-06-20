import delegate from 'delegate'
import EditMode from './EditMode'
import isRangeInTextBox from './isRangeInTextBox'
import anemone from '../../../../component/anemone'

class TextEditDialog {
  #dialog

  constructor(editorHTMLElement, submitHandler) {
    const dialog = document.createElement('dialog')
    dialog.classList.add('textae-editor__text-edit-dialog')
    editorHTMLElement.appendChild(dialog)
    dialog.addEventListener('close', (event) => {
      const dialog = event.target
      const { returnValue } = dialog
      if (returnValue === 'OK') {
        const form = dialog.querySelector('form')
        const begin = form.begin.value
        const end = form.end.value
        const text = form.text.value
        submitHandler(begin, end, text)
      }
    })

    delegate(
      dialog,
      '.textae-editor__text-edit-dialog__close-button',
      'click',
      (e) => {
        dialog.close()
      }
    )
    delegate(
      dialog,
      '.textae-editor__text-edit-dialog__text-box',
      'keyup',
      (e) => {
        e.stopPropagation()
      }
    )

    this.#dialog = dialog
  }

  open(begin, end, text) {
    this.#dialog.innerHTML = this.#template({ begin, end, text })
    this.#dialog.showModal()
  }

  #template(context) {
    const { text, begin, end } = context
    return anemone`
      <div class="textae-editor__text-edit-dialog__title-bar">
        <h1>Edit text dialog</h1>
        <button class="textae-editor__text-edit-dialog__close-button">X</button>
      </div>
      <h3>Original Text</h3>
      <div>${text}</div>
      <h3>Edit text</h3>
      <form method="dialog">
        <input type="hidden" name="begin" value="${begin}">
        <input type="hidden" name="end" value="${end}">
        <textarea class="textae-editor__text-edit-dialog__text-box" name="text">${text}</textarea>
        <br>
        <div class="textae-editor__text-edit-dialog__button-bar">
          <button value="OK">OK</button>
        </div>
      </form>
    `
  }
}

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
                if (!this.#annotationModel.validateEditableText(begin, end)) {
                  return
                }

                const targetText = this.#annotationModel.getTextBetween(
                  begin,
                  end
                )

                this.#dialog.open(begin, end, targetText)
              }
            }
          }
        }
      )
    )

    return listeners
  }
}
