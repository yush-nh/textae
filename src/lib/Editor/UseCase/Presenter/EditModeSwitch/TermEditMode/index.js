import MouseEventHandler from './MouseEventHandler'
import SpanEditor from './SpanEditor'
import EditMode from '../EditMode'
import TypeValuesPallet from '../../../../../component/TypeValuesPallet'
import isRangeInTextBox from '../isRangeInTextBox'
import SelectionWrapper from '../SelectionWrapper'
import AttributeEditor from '../AttributeEditor'
import SelectionAttributePallet from '../../../../../component/SelectionAttributePallet'
import PropertyEditor from '../EditMode/PropertyEditor'

export default class TermEditMode extends EditMode {
  #mouseEventHandler
  #spanEditor
  #textBox
  #spanInstanceContainer
  #propertyEditor
  #selectionModel

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
      annotationModel.attributeInstanceContainer,
      annotationModel.typeDefinition.denotation,
      selectionModel.entity,
      commander,
      'Term configuration',
      menuState,
      mousePoint
    )

    const getAutocompletionWs = () =>
      autocompletionWs || annotationModel.typeDefinition.autocompletionWs
    const attributeEditor = new AttributeEditor(
      commander,
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
      attributeEditor,
      getAutocompletionWs,
      annotationModel.typeDefinition.denotation,
      'entity',
      denotationPallet
    )

    const spanEditor = new SpanEditor(
      editorHTMLElement,
      annotationModel,
      selectionModel,
      commander,
      menuState,
      spanConfig
    )

    this.#mouseEventHandler = new MouseEventHandler(
      editorHTMLElement,
      annotationModel,
      selectionModel,
      denotationPallet,
      spanEditor
    )

    this.#propertyEditor = new PropertyEditor(
      editorHTMLElement,
      commander,
      denotationPallet,
      mousePoint,
      annotationModel.typeDefinition.denotation,
      annotationModel,
      getAutocompletionWs
    )
    this.#selectionModel = selectionModel

    // For touch device actions
    this.#spanEditor = spanEditor
    this.#textBox = editorHTMLElement.querySelector('.textae-editor__text-box')
    this.#spanInstanceContainer = annotationModel.spanInstanceContainer
  }

  bindMouseEvents() {
    return this.#mouseEventHandler.bind()
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
      const { begin, end } = this.#spanInstanceContainer.textSelection
      const isSelectionTextCrossingAnySpan =
        this.#spanInstanceContainer.isBoundaryCrossingWithOtherSpans(begin, end)

      const { isParentOfBothNodesSame } = new SelectionWrapper()
      this._updateButtonsToOperateSpanWithTouchDevice(
        isParentOfBothNodesSame,
        isSelectionTextCrossingAnySpan,
        isSelectionTextCrossingAnySpan
      )
    } else {
      this._updateButtonsToOperateSpanWithTouchDevice(false, false, false)
    }
  }

  editProperties() {
    this.#propertyEditor.startEditing(
      this.#selectionModel.entity,
      'Entity',
      'Denotation'
    )
  }
}
