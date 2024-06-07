import clearTextSelection from '../clearTextSelection'
import SelectionWrapper from '../SelectionWrapper'
import selectSpan from '../selectSpan'
import isRangeInTextBox from '../isRangeInTextBox'
import bindMouseEvents from './bindMouseEvents'

export default class MouseEventHandler {
  #editorHTMLElement
  #annotationModel
  #selectionModel
  #spanEditor
  #pallet

  constructor(
    editorHTMLElement,
    annotationModel,
    selectionModel,
    pallet,
    spanEditor
  ) {
    this.#editorHTMLElement = editorHTMLElement
    this.#annotationModel = annotationModel
    this.#selectionModel = selectionModel
    this.#spanEditor = spanEditor
    this.#pallet = pallet
  }

  bind() {
    return bindMouseEvents(this.#editorHTMLElement, this)
  }

  bodyClicked() {
    this.#pallet.hide()
    this.#selectionModel.removeAll()
  }

  textBoxClicked() {
    this.#pallet.hide()

    const selection = window.getSelection()

    if (
      isRangeInTextBox(
        selection,
        this.#editorHTMLElement.querySelector('.textae-editor__text-box')
      )
    ) {
      this.#spanEditor.editFor(new SelectionWrapper(this.#annotationModel.span))
    } else {
      this.#selectionModel.removeAll()
    }
  }

  denotationSpanClicked(event) {
    // When you click on the text, the browser will automatically select the word.
    // Therefore, the editor shrinks spans instead of selecting spans.
    // Deselect the text.
    if (event.button === 2) {
      clearTextSelection()
    }

    const selection = window.getSelection()

    // When you create a denotation span and
    // click on another denotation span while holding down the Shift key,
    // the Selection type will be 'None'.
    if (selection.type === 'Caret' || selection.type === 'None') {
      this.#selectSpan(event, event.target.id)
    }

    if (
      isRangeInTextBox(
        selection,
        this.#editorHTMLElement.querySelector('.textae-editor__text-box')
      )
    ) {
      this.#spanEditor.editFor(new SelectionWrapper(this.#annotationModel.span))
    }
  }

  blockSpanClicked(e) {
    // When you click on the text, the browser will automatically select the word.
    // Therefore, the editor shrinks spans instead of selecting spans.
    // Deselect the text.
    if (e.button === 2) {
      clearTextSelection()
    }

    const selection = window.getSelection()

    if (selection.type === 'Caret') {
      this.#selectionModel.removeAll()
    }

    if (
      isRangeInTextBox(
        selection,
        this.#editorHTMLElement.querySelector('.textae-editor__text-box')
      )
    ) {
      this.#spanEditor.editFor(new SelectionWrapper(this.#annotationModel.span))
    }
  }

  styleSpanClicked(e) {
    // When you click on the text, the browser will automatically select the word.
    // Therefore, the editor shrinks spans instead of selecting spans.
    // Deselect the text.
    if (e.button === 2) {
      clearTextSelection()
    }

    const selection = window.getSelection()

    if (selection.type === 'Caret') {
      const span = e.target.closest('.textae-editor__span')
      if (span) {
        this.#selectSpan(e, span.id)
      } else {
        this.#selectionModel.removeAll()
      }
    }

    if (
      isRangeInTextBox(
        selection,
        this.#editorHTMLElement.querySelector('.textae-editor__text-box')
      )
    ) {
      this.#spanEditor.editFor(new SelectionWrapper(this.#annotationModel.span))
    }
  }

  signboardClicked() {
    this.#editorHTMLElement.focus()
  }

  typeValuesClicked(event, entityID) {
    if (this.#annotationModel.entity.get(entityID).isDenotation) {
      if (event.ctrlKey || event.metaKey) {
        this.#selectionModel.entity.toggle(entityID)
      } else {
        this.#selectionModel.selectEntity(entityID)
      }
    }
  }

  #selectSpan(event, spanID) {
    const selectedSpanID = this.#selectionModel.span.singleId
    const rangeOfSpans =
      event.shiftKey && selectedSpanID
        ? this.#annotationModel.span.rangeDenotationSpan(selectedSpanID, spanID)
        : []

    selectSpan(this.#selectionModel, rangeOfSpans, event, spanID)
  }
}
