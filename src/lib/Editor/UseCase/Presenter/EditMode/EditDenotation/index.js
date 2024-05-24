import MouseEventHandler from './MouseEventHandler'
import SpanEditor from './SpanEditor'
import Edit from '../Edit'
import bindMouseEvents from './bindMouseEvents'
import TypeValuesPallet from '../../../../../component/TypeValuesPallet'
import isRangeInTextBox from '../isRangeInTextBox'
import OrderedPositions from '../OrderedPositions'
import SelectionWrapper from '../SelectionWrapper'
import AttributeEditor from '../AttributeEditor'
import SelectionAttributePallet from '../../../../../component/SelectionAttributePallet'

export default class EditDenotation extends Edit {
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
    commander,
    menuState,
    spanConfig,
    autocompletionWs,
    mousePoint
  ) {
    const denotationPallet = new TypeValuesPallet(
      editorHTMLElement,
      eventEmitter,
      annotationModel.typeDefinition,
      annotationModel.attribute,
      annotationModel.typeDefinition.denotation,
      selectionModel.entity,
      commander,
      'Term configuration',
      menuState,
      mousePoint
    )

    const spanEditor = new SpanEditor(
      editorHTMLElement,
      annotationModel,
      selectionModel,
      commander,
      menuState,
      spanConfig
    )

    const getAutocompletionWs = () =>
      autocompletionWs || annotationModel.typeDefinition.autocompletionWs
    const attributeEditor = new AttributeEditor(
      commander,
      annotationModel,
      selectionModel.entity,
      new SelectionAttributePallet(editorHTMLElement, mousePoint),
      () => this.editProperties(),
      denotationPallet
    )

    super(
      editorHTMLElement,
      annotationModel,
      selectionModel,
      commander,
      menuState,
      denotationPallet,
      attributeEditor,
      getAutocompletionWs,
      annotationModel.typeDefinition.denotation,
      'entity'
    )

    this.#mouseEventHandler = new MouseEventHandler(
      editorHTMLElement,
      annotationModel,
      selectionModel,
      denotationPallet,
      spanEditor
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
        selectionWrapper.isParentOfBothNodesSame,
        isSelectionTextCrossingAnySpan,
        isSelectionTextCrossingAnySpan
      )
    } else {
      super.applyTextSelectionWithTouchDevice()
    }
  }

  editProperties() {
    if (this._selectionModel.entity.some) {
      this._createEditPropertiesDialog(
        'Entity',
        'Entity',
        this._selectionModel.entity.all,
        this.#mousePoint
      )
        .open()
        .then((values) => this._typeValuesChanged(values))
    }
  }
}
