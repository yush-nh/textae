import SpanEditor from './SpanEditor'
import bindMouseEvents from './bindMouseEvents'
import MouseEventHandler from './MouseEventHandler'
import Edit from '../Edit'
import EditBlockHandler from './EditBlockHandler'
import TypeValuesPallet from '../../../../../component/TypeValuesPallet'

export default class EditBlock extends Edit {
  constructor(
    editorHTMLElement,
    eventEmitter,
    annotationData,
    selectionModel,
    spanConfig,
    commander,
    buttonController,
    originalData,
    autocompletionWs
  ) {
    const spanEditor = new SpanEditor(
      editorHTMLElement,
      annotationData,
      spanConfig,
      commander,
      buttonController,
      selectionModel
    )

    const blockPallet = new TypeValuesPallet(
      editorHTMLElement,
      eventEmitter,
      originalData,
      annotationData,
      annotationData.typeDefinition.block,
      selectionModel.entity,
      commander,
      'Entity configuration'
    )

    const getAutocompletionWs = () =>
      autocompletionWs || annotationData.typeDefinition.autocompletionWs

    const handler = new EditBlockHandler(
      editorHTMLElement,
      annotationData.typeDefinition.block,
      commander,
      annotationData,
      selectionModel,
      blockPallet,
      getAutocompletionWs
    )

    super(
      editorHTMLElement,
      bindMouseEvents,
      new MouseEventHandler(
        editorHTMLElement,
        annotationData,
        selectionModel,
        spanEditor,
        blockPallet
      ),
      handler,
      blockPallet,
      commander,
      getAutocompletionWs,
      annotationData.typeDefinition.block
    )

    this._spanEdtior = spanEditor
    this._buttonController = buttonController
  }

  createSpan() {
    this._mouseEventHandler.textBoxClicked()
  }

  expandSpan() {
    this._spanEdtior.expandForTouchDevice()
  }

  shrinkSpan() {
    this._spanEdtior.shrinkForTouchDevice()
  }

  applyTextSelection() {
    this._buttonController.applyTextSelection()
  }
}
