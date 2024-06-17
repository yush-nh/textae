import SpanEditor from './SpanEditor'
import MouseEventHandler from './MouseEventHandler'
import EditMode from '../EditMode'
import TypeValuesPallet from '../../../../../component/TypeValuesPallet'
import isRangeInTextBox from '../isRangeInTextBox'
import SelectionWrapper from '../SelectionWrapper'
import AttributeEditor from '../AttributeEditor'
import SelectionAttributePallet from '../../../../../component/SelectionAttributePallet'
import PropertyEditor from '../EditMode/PropertyEditor'

export default class BlockEditMode extends EditMode {
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
    spanConfig,
    commander,
    menuState,
    autocompletionWs,
    mousePoint
  ) {
    const blockPallet = new TypeValuesPallet(
      editorHTMLElement,
      eventEmitter,
      annotationModel.typeDefinition,
      annotationModel.attributeInstanceContainer,
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
      attributeEditor,
      getAutocompletionWs,
      annotationModel.typeDefinition.block,
      'entity',
      mousePoint,
      blockPallet
    )

    const spanEditor = new SpanEditor(
      editorHTMLElement,
      annotationModel,
      spanConfig,
      commander,
      menuState,
      selectionModel
    )

    this.#mouseEventHandler = new MouseEventHandler(
      editorHTMLElement,
      annotationModel,
      selectionModel,
      spanEditor,
      blockPallet
    )

    this.#propertyEditor = new PropertyEditor(
      editorHTMLElement,
      commander,
      blockPallet,
      mousePoint,
      annotationModel.typeDefinition.block,
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

      const { isParentOfBothNodesTextBox } = new SelectionWrapper()
      this._updateButtonsToOperateSpanWithTouchDevice(
        isParentOfBothNodesTextBox,
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
      'Block',
      'Entity'
    )
  }
}
