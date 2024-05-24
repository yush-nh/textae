import SpanEditor from './SpanEditor'
import bindMouseEvents from './bindMouseEvents'
import MouseEventHandler from './MouseEventHandler'
import Edit from '../Edit'
import TypeValuesPallet from '../../../../../component/TypeValuesPallet'
import isRangeInTextBox from '../isRangeInTextBox'
import OrderedPositions from '../OrderedPositions'
import SelectionWrapper from '../SelectionWrapper'
import AttributeEditor from '../AttributeEditor'
import SelectionAttributePallet from '../../../../../component/SelectionAttributePallet'

export default class EditBlock extends Edit {
  #mouseEventHandler
  #spanEditor
  #textBox
  #spanModelContainer
  #mousePoint

  constructor(
    editorHTMLElement,
    eventEmitter,
    annotationModel,
    selectionModel,
    spanConfig,
    commander,
    menuState,
    autocompletionWs,
    mousePoint
  ) {
    const spanEditor = new SpanEditor(
      editorHTMLElement,
      annotationModel,
      spanConfig,
      commander,
      menuState,
      selectionModel
    )

    const blockPallet = new TypeValuesPallet(
      editorHTMLElement,
      eventEmitter,
      annotationModel.typeDefinition,
      annotationModel.attribute,
      annotationModel.typeDefinition.block,
      selectionModel.entity,
      commander,
      'Block configuration',
      menuState,
      mousePoint
    )

    const getAutocompletionWs = () =>
      autocompletionWs || annotationModel.typeDefinition.autocompletionWs
    const attributeEditor = new AttributeEditor(
      commander,
      annotationModel,
      selectionModel.entity,
      new SelectionAttributePallet(editorHTMLElement, mousePoint),
      () => this.editProperties(),
      blockPallet
    )

    super(
      editorHTMLElement,
      annotationModel,
      selectionModel,
      commander,
      menuState,
      blockPallet,
      attributeEditor,
      getAutocompletionWs,
      annotationModel.typeDefinition.block,
      'entity'
    )

    this.#mouseEventHandler = new MouseEventHandler(
      editorHTMLElement,
      annotationModel,
      selectionModel,
      spanEditor,
      blockPallet
    )
    this.#spanEditor = spanEditor
    this.#textBox = editorHTMLElement.querySelector('.textae-editor__text-box')
    this.#spanModelContainer = annotationModel.span
    this.#mousePoint = mousePoint
  }

  bindMouseEvents() {
    return super._bindMouseEvents(bindMouseEvents, this.#mouseEventHandler)
  }

  createSpanWithTouchDevice() {
    this.#spanEditor.cerateSpanForTouchDevice()
  }

  expandSpanWithTouchDevice() {
    this.#spanEditor.expandForTouchDevice()
  }

  shrinkSpanWithTouchDevice() {
    this.#spanEditor.shrinkForTouchDevice()
  }

  applyTextSelectionWithTouchDevice() {
    if (isRangeInTextBox(window.getSelection(), this.#textBox)) {
      const selectionWrapper = new SelectionWrapper(this.#spanModelContainer)
      const { begin, end } = new OrderedPositions(
        selectionWrapper.positionsOnAnnotation
      )
      const isSelectionTextCrossingAnySpan =
        this.#spanModelContainer.isBoundaryCrossingWithOtherSpans(begin, end)

      this._updateButtonsToOperateSpanWithTouchDevice(
        selectionWrapper.isParentOfBothNodesTextBox,
        isSelectionTextCrossingAnySpan,
        isSelectionTextCrossingAnySpan
      )
    } else {
      super.applyTextSelectionWithTouchDevice()
    }
  }

  editProperties() {
    this._editProperties(
      this._selectionModel.entity,
      'Block',
      'Entity',
      this.#mousePoint
    )
  }
}
