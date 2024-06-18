import MouseEventHandler from './MouseEventHandler'
import EditMode from '../EditMode'
import TypeValuesPallet from '../../../../../component/TypeValuesPallet'
import AttributeEditor from '../AttributeEditor'
import SelectionAttributePallet from '../../../../../component/SelectionAttributePallet'
import PropertyEditor from '../EditMode/PropertyEditor'
import forwardMethods from '../../../../forwardMethods'
import PalletWrapper from '../PalletWrapper'

export default class RelationEditMode extends EditMode {
  #mouseEventHandler
  #propertyEditor
  #selectionModel
  #pallet

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
    super()

    const getAutocompletionWs = () =>
      autocompletionWs || annotationModel.typeDictionary.autocompletionWs

    const relationPallet = new TypeValuesPallet(
      editorHTMLElement,
      eventEmitter,
      annotationModel.typeDictionary,
      annotationModel.attributeInstanceContainer,
      annotationModel.typeDictionary.relation,
      selectionModel.relation,
      commander,
      'Relation configuration',
      menuState,
      mousePoint
    )
    const pallet = new PalletWrapper(
      relationPallet,
      commander,
      getAutocompletionWs,
      annotationModel.typeDictionary.relation,
      'relation',
      selectionModel,
      annotationModel
    )
    pallet.appendTo(editorHTMLElement)
    forwardMethods(this, () => pallet, [
      'showPallet',
      'hidePallet',
      'selectLeftAttributeTab',
      'selectRightAttributeTab'
    ])
    this.#pallet = pallet

    this.#mouseEventHandler = new MouseEventHandler(
      editorHTMLElement,
      selectionModel,
      commander,
      annotationModel.typeDictionary,
      relationPallet
    )

    this.#propertyEditor = new PropertyEditor(
      editorHTMLElement,
      commander,
      relationPallet,
      'Relation',
      mousePoint,
      annotationModel.typeDictionary.relation,
      annotationModel,
      'Relation',
      getAutocompletionWs
    )
    this.#selectionModel = selectionModel

    const attributeEditor = new AttributeEditor(
      commander,
      annotationModel.typeDictionary,
      selectionModel.relation,
      new SelectionAttributePallet(editorHTMLElement, mousePoint),
      () => this.editProperties(),
      relationPallet
    )
    forwardMethods(this, () => attributeEditor, ['manipulateAttribute'])
  }

  bindMouseEvents() {
    return this.#mouseEventHandler.bind()
  }

  editProperties() {
    this.#propertyEditor.startEditing(this.#selectionModel.relation)
  }

  get isPalletShown() {
    return this.#pallet.visibility
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
