import { MODE } from '../../../../MODE'
import State from './State'
import EditDenotation from './EditDenotation'
import EditBlock from './EditBlock'
import EditRelation from './EditRelation'
import ModeReactor from './ModeReactor'

export default class EditModeSwitch {
  #editDenotation
  #editBlock
  #editRelation
  #state
  #annotationModel
  #startUpOptions

  /**
   *
   * @param {import('../../../StartUpOptions').default} startUpOptions
   */
  constructor(
    editorHTMLElement,
    eventEmitter,
    annotationModel,
    selectionModel,
    spanConfig,
    commander,
    menuState,
    startUpOptions,
    functionAvailability,
    mousePoint
  ) {
    this.#editDenotation = new EditDenotation(
      editorHTMLElement,
      eventEmitter,
      annotationModel,
      selectionModel,
      commander,
      menuState,
      spanConfig,
      startUpOptions.autocompletionWs,
      mousePoint
    )

    this.#editBlock = new EditBlock(
      editorHTMLElement,
      eventEmitter,
      annotationModel,
      selectionModel,
      spanConfig,
      commander,
      menuState,
      startUpOptions.autocompletionWs,
      mousePoint
    )

    this.#editRelation = new EditRelation(
      editorHTMLElement,
      eventEmitter,
      annotationModel,
      selectionModel,
      commander,
      startUpOptions.autocompletionWs,
      menuState,
      mousePoint
    )

    new ModeReactor(
      editorHTMLElement,
      eventEmitter,
      annotationModel,
      this.#editDenotation,
      this.#editBlock,
      this.#editRelation
    )

    this.#state = new State(
      annotationModel.relation,
      eventEmitter,
      functionAvailability
    )

    this.#annotationModel = annotationModel
    this.#startUpOptions = startUpOptions

    eventEmitter
      .on('textae-event.editor.relation.click', (event, relation) =>
        this.currentMode.relationClicked(event, relation)
      )
      .on('textae-event.editor.relation-bollard.click', (event, entity) =>
        this.currentMode.relationBollardClicked(entity)
      )
  }

  toViewMode() {
    this.closePallet()
    this.#state.toViewMode(this.#state.nextShowRelation)
  }

  toEditTermMode() {
    this.closePallet()
    this.#state.toEditTermMode(this.#state.nextShowRelation)
  }

  toEditBlockMode() {
    this.closePallet()
    this.#state.toEditBlockMode(this.#state.nextShowRelation)
  }

  toEditRelationMode() {
    this.closePallet()
    this.#state.toEditRelationMode()
  }

  toggleSimpleMode() {
    this.closePallet()
    this.#state.toggleSimpleMode()
  }

  changeModeByShortcut() {
    this.closePallet()
    this.#state.changeModeByShortcut()
  }

  get isEditDenotation() {
    return this.#state.currentState === MODE.EDIT_DENOTATION
  }

  /**
   * For an initiation transition on an annotations data loaded.
   */
  reset() {
    if (this.#startUpOptions.isEditTermMode) {
      this.#state.toEditTermMode(this.#annotationModel.relation.some)
      return
    }

    if (this.#startUpOptions.isEditBlockMode) {
      this.#state.toEditBlockMode(this.#annotationModel.relation.some)
      return
    }

    if (this.#startUpOptions.isEditRelationMode) {
      this.#state.toEditRelationMode()
      return
    }

    this.#state.toViewMode(this.#annotationModel.relation.some)
  }

  closePallet() {
    // Close all pallets.
    this.#editDenotation.pallet.hide()
    this.#editBlock.pallet.hide()
    this.#editRelation.pallet.hide()
  }

  get isTypeValuesPalletShown() {
    return (
      this.#editDenotation.pallet.visibly ||
      this.#editBlock.pallet.visibly ||
      this.#editRelation.pallet.visibly
    )
  }

  selectLeftAttributeTab() {
    this.currentMode.pallet.selectLeftAttributeTab()
  }

  selectRightAttributeTab() {
    this.currentMode.pallet.selectRightAttributeTab()
  }

  get currentMode() {
    switch (this.#state.currentState) {
      case MODE.EDIT_DENOTATION:
        return this.#editDenotation
      case MODE.EDIT_BLOCK:
        return this.#editBlock
      case MODE.EDIT_RELATION:
        return this.#editRelation
      default:
        return {
          showPallet() {},
          selectLeftAttributeTab() {},
          selectRightAttributeTab() {},
          editProperties() {},
          manipulateAttribute() {},
          relationClicked() {},
          relationBollardClicked(entity) {
            entity.focus()
          },
          applyTextSelectionWithTouchDevice() {}
        }
    }
  }
}
