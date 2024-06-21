import SpanEditor from './SpanEditor'
import MouseEventHandler from './MouseEventHandler'
import EditMode from '../EditMode'
import isRangeInTextBox from '../isRangeInTextBox'
import SelectionWrapper from '../SelectionWrapper'
import AttributeEditor from '../AttributeEditor'
import SelectionAttributePallet from '../../../../../component/SelectionAttributePallet'
import PropertyEditor from '../EditMode/PropertyEditor'
import forwardMethods from '../../../../forwardMethods'
import PalletFactory from '../PalletFactory'

export default class BlockEditMode extends EditMode {
  #mouseEventHandler
  #spanEditor
  #textBox
  #spanInstanceContainer
  #propertyEditor
  #selectionModel
  #menuState
  #pallet

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
    super()

    const getAutocompletionWs = () =>
      autocompletionWs || annotationModel.typeDictionary.autocompletionWs

    this.#pallet = PalletFactory.create(
      editorHTMLElement,
      eventEmitter,
      annotationModel.typeDictionary,
      annotationModel.attributeInstanceContainer,
      annotationModel.typeDictionary.block,
      selectionModel.entity,
      commander,
      'Block configuration',
      menuState,
      mousePoint,
      getAutocompletionWs,
      'entity',
      selectionModel,
      annotationModel,
      this
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
      this.#pallet
    )

    this.#propertyEditor = new PropertyEditor(
      editorHTMLElement,
      commander,
      this.#pallet,
      'Block',
      mousePoint,
      annotationModel.typeDictionary.block,
      annotationModel,
      'Entity',
      getAutocompletionWs
    )
    this.#selectionModel = selectionModel

    // For touch device actions
    this.#spanEditor = spanEditor
    this.#textBox = editorHTMLElement.querySelector('.textae-editor__text-box')
    this.#spanInstanceContainer = annotationModel.spanInstanceContainer
    this.#menuState = menuState

    const attributeEditor = new AttributeEditor(
      commander,
      annotationModel.typeDictionary,
      selectionModel.entity,
      new SelectionAttributePallet(editorHTMLElement, mousePoint),
      () => this.editProperties(),
      this.#pallet
    )
    forwardMethods(this, () => attributeEditor, ['manipulateAttribute'])
  }

  bindMouseEvents() {
    return this.#mouseEventHandler.bind()
  }

  editProperties() {
    this.#propertyEditor.startEditing(this.#selectionModel.entity)
  }

  get isPalletShown() {
    return this.#pallet.visibility
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
    if (isRangeInTextBox(this.#textBox)) {
      const { begin, end } = this.#spanInstanceContainer.textSelection
      const isSelectionTextCrossingAnySpan =
        this.#spanInstanceContainer.isBoundaryCrossingWithOtherSpans(begin, end)

      const { isParentOfBothNodesTextBox } = new SelectionWrapper()
      this.#menuState.updateButtonsToOperateSpanWithTouchDevice(
        isParentOfBothNodesTextBox,
        isSelectionTextCrossingAnySpan,
        isSelectionTextCrossingAnySpan
      )
    } else {
      this.#menuState.updateButtonsToOperateSpanWithTouchDevice(
        false,
        false,
        false
      )
    }
  }
}
