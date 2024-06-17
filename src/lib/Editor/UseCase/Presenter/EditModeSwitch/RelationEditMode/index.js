import MouseEventHandler from './MouseEventHandler'
import EditMode from '../EditMode'
import TypeValuesPallet from '../../../../../component/TypeValuesPallet'
import AttributeEditor from '../AttributeEditor'
import SelectionAttributePallet from '../../../../../component/SelectionAttributePallet'
import PropertyEditor from '../EditMode/PropertyEditor'

export default class RelationEditMode extends EditMode {
  #mouseEventHandler
  #propertyEditor
  #selectionModel

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
      annotationModel.attributeInstanceContainer,
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
      attributeEditor,
      getAutocompletionWs,
      annotationModel.typeDefinition.relation,
      'relation',
      relationPallet
    )

    this.#mouseEventHandler = new MouseEventHandler(
      editorHTMLElement,
      selectionModel,
      commander,
      annotationModel.typeDefinition,
      relationPallet
    )

    this.#propertyEditor = new PropertyEditor(
      editorHTMLElement,
      commander,
      relationPallet,
      'Relation',
      mousePoint,
      annotationModel.typeDefinition.relation,
      annotationModel,
      'Relation',
      getAutocompletionWs
    )
    this.#selectionModel = selectionModel
  }

  bindMouseEvents() {
    return this.#mouseEventHandler.bind()
  }

  editProperties() {
    this.#propertyEditor.startEditing(this.#selectionModel.relation)
  }

  relationClicked(event, relation) {
    if (event.ctrlKey || event.metaKey) {
      this.#selectionModel.relation.toggle(relation.id)
    } else {
      this.#selectionModel.selectRelation(relation.id)
    }
  }

  relationBollardClicked(entity) {
    entity.span.forceRenderGrid()
    this.#selectionModel.selectEntity(entity.id)
  }
}
