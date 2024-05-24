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
import EditPropertiesDialog from '../../../../../component/EditPropertiesDialog'

export default class EditBlock extends Edit {
  #mouseEventHandler
  #spanEditor
  #menuState
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
      selectionModel,
      annotationModel,
      blockPallet,
      commander,
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
    this.#menuState = menuState
    this.#textBox = editorHTMLElement.querySelector('.textae-editor__text-box')
    this.#spanModelContainer = annotationModel.span
    this.#mousePoint = mousePoint
  }

  bindMouseEvents() {
    return bindMouseEvents(this._editorHTMLElement, this.#mouseEventHandler)
  }

  createSpan() {
    this.#spanEditor.cerateSpanForTouchDevice()
  }

  expandSpan() {
    this.#spanEditor.expandForTouchDevice()
  }

  shrinkSpan() {
    this.#spanEditor.shrinkForTouchDevice()
  }

  applyTextSelection() {
    if (isRangeInTextBox(window.getSelection(), this.#textBox)) {
      const selectionWrapper = new SelectionWrapper(this.#spanModelContainer)
      const { begin, end } = new OrderedPositions(
        selectionWrapper.positionsOnAnnotation
      )
      const isSelectionTextCrossingAnySpan =
        this.#spanModelContainer.isBoundaryCrossingWithOtherSpans(begin, end)

      this.#menuState.updateButtonsToOperateSpanWithTouchDevice(
        selectionWrapper.isParentOfBothNodesTextBox,
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

  editProperties() {
    if (this._selectionModel.entity.some) {
      new EditPropertiesDialog(
        this._editorHTMLElement,
        'Block',
        'Entity',
        this._definitionContainer,
        this._annotationModel.typeDefinition.attribute,
        this._getAutocompletionWs(),
        this._selectionModel.entity.all,
        this.pallet,
        this.#mousePoint
      )
        .open()
        .then((values) => this._typeValuesChanged(values))
    }
  }
}
