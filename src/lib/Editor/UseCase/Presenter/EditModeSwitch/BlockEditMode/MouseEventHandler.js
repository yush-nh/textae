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

  /**
   *
   * @param {import('./SpanEditor').default} spanEditor
   */
  constructor(
    editorHTMLElement,
    annotationModel,
    selectionModel,
    spanEditor,
    pallet
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
    const selection = window.getSelection()

    if (selection.type === 'Caret') {
      this.#pallet.hide()
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

  blockSpanClicked() {
    const selection = window.getSelection()

    if (selection.type === 'Caret') {
      this.#pallet.hide()
      clearTextSelection()
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

  // Mouse events to the block span are handled by the hit area instead,
  // to show the block span shifted up half a line.
  blockHitAreaClicked(e) {
    // When you click on the text, the browser will automatically select the word.
    // Therefore, the editor shrinks spans instead of selecting spans.
    // Deselect the text.
    if (e.button === 2) {
      clearTextSelection()
    }

    const selection = window.getSelection()

    // When you create a block span and
    // click on another block span while holding down the Shift key,
    // the Selection type will be 'None'.
    if (selection.type === 'Caret' || selection.type === 'None') {
      const spanId = e.target.dataset.id

      this.#selectSpanAndEntity(e, spanId)
    }
  }

  styleSpanClicked(e) {
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
      e.stopPropagation()
    }
  }

  denotationSpanClicked(e) {
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
      e.stopPropagation()
    }
  }

  signboardClicked() {
    this.#editorHTMLElement.focus()
  }

  typeValuesClicked(event, entityID) {
    const entity = this.#annotationModel.entity.get(entityID)

    if (entity.isBlock) {
      if (event.ctrlKey || event.metaKey) {
        this.#selectionModel.entity.toggle(entityID)
      } else {
        this.#selectionModel.selectEntity(entityID)
      }

      // Select span of the selected entity.
      const spans = this.#selectionModel.entity.all
        .map((entity) => entity.span)
        .map((span) => span.id)
      this.#selectionModel.add('span', spans)
    }
  }

  #selectSpanAndEntity(event, spanID) {
    const selectedSpanID = this.#selectionModel.span.singleId
    const rangeOfSpans =
      event.shiftKey && selectedSpanID
        ? this.#annotationModel.span.rangeBlockSpan(selectedSpanID, spanID)
        : []

    selectSpan(this.#selectionModel, rangeOfSpans, event, spanID)

    // Select entities of the selected span.
    // Block is a first entity of the span.
    const entities = this.#selectionModel.span.all
      .map((span) => span.entities.at(0))
      .map((entity) => entity.id)

    this.#selectionModel.add('entity', entities)
  }
}
