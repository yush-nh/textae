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
import EditPropertiesDialog from '../../../../../component/EditPropertiesDialog'

export default class EditDenotation extends Edit {
  #mouseEventHandler
  #spanEditor
  #controlViewModel
  #textBox
  #spanModelContainer
  #mousePoint

  constructor(
    editorHTMLElement,
    eventEmitter,
    annotationModel,
    selectionModel,
    commander,
    controlViewModel,
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
      controlViewModel,
      mousePoint
    )

    const spanEditor = new SpanEditor(
      editorHTMLElement,
      annotationModel,
      selectionModel,
      commander,
      controlViewModel,
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
      selectionModel,
      annotationModel,
      denotationPallet,
      commander,
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
    this.#controlViewModel = controlViewModel
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

      this.#controlViewModel.updateManipulateSpanButtons(
        selectionWrapper.isParentOfBothNodesSame,
        isSelectionTextCrossingAnySpan,
        isSelectionTextCrossingAnySpan
      )
    } else {
      this.#controlViewModel.updateManipulateSpanButtons(false, false, false)
    }
  }

  editProperties() {
    if (this._selectionModel.entity.some) {
      new EditPropertiesDialog(
        this._editorHTMLElement,
        'Entity',
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
