import bindMouseEvents from './bindMouseEvents'
import MouseEventHandler from './MouseEventHandler'
import EditMode from '../EditMode'
import TypeValuesPallet from '../../../../../component/TypeValuesPallet'
import AttributeEditor from '../AttributeEditor'
import SelectionAttributePallet from '../../../../../component/SelectionAttributePallet'

export default class RelationEditMode extends EditMode {
  #mouseEventHandler

  constructor(
    editorHTMLElement,
    eventEmitter,
    annotationModel,
    selectionModel,
    commander,
    autocompletionWs,
    menuState,
    mousePoint
  ) {
    const relationPallet = new TypeValuesPallet(
      editorHTMLElement,
      eventEmitter,
      annotationModel.typeDefinition,
      annotationModel.attribute,
      annotationModel.typeDefinition.relation,
      selectionModel.relation,
      commander,
      'Relation configuration',
      menuState,
      mousePoint
    )

    const getAutocompletionWs = () =>
      autocompletionWs || annotationModel.typeDefinition.autocompletionWs
    const attributeEditor = new AttributeEditor(
      commander,
      annotationModel,
      selectionModel.relation,
      new SelectionAttributePallet(editorHTMLElement, mousePoint),
      () => this.editProperties(),
      relationPallet
    )

    super(
      editorHTMLElement,
      annotationModel,
      selectionModel,
      commander,
      menuState,
      relationPallet,
      attributeEditor,
      getAutocompletionWs,
      annotationModel.typeDefinition.relation,
      'relation',
      mousePoint
    )

    this.#mouseEventHandler = new MouseEventHandler(
      editorHTMLElement,
      selectionModel,
      commander,
      annotationModel.typeDefinition,
      relationPallet
    )
  }

  bindMouseEvents() {
    return super._bindMouseEvents(bindMouseEvents, this.#mouseEventHandler)
  }

  editProperties() {
    this._editProperties(this._selectionModel.relation, 'Relation', 'Relation')
  }

  relationClicked(event, relation) {
    if (event.ctrlKey || event.metaKey) {
      this._selectionModel.relation.toggle(relation.id)
    } else {
      this._selectionModel.selectRelation(relation.id)
    }
  }

  relationBollardClicked(entity) {
    entity.span.forceRenderGrid()
    this._selectionModel.selectEntity(entity.id)
  }
}
