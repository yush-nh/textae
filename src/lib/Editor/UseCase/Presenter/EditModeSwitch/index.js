import { MODE } from '../../../../MODE'
import State from './State'
import TermEditMode from './TermEditMode'
import BlockEditMode from './BlockEditMode'
import RelationEditMode from './RelationEditMode'
import ModeTransitionReactor from './ModeTransitionReactor'

export default class EditModeSwitch {
  #termEditMode
  #blockEditMode
  #relationEditMode
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
    this.#termEditMode = new TermEditMode(
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

    this.#blockEditMode = new BlockEditMode(
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

    this.#relationEditMode = new RelationEditMode(
      editorHTMLElement,
      eventEmitter,
      annotationModel,
      selectionModel,
      commander,
      startUpOptions.autocompletionWs,
      menuState,
      mousePoint
    )

    new ModeTransitionReactor(
      editorHTMLElement,
      eventEmitter,
      annotationModel,
      this.#termEditMode,
      this.#blockEditMode,
      this.#relationEditMode
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
    this.hidePallet()
    this.#state.toViewMode(this.#state.nextShowRelation)
  }

  toTermEditMode() {
    this.hidePallet()
    this.#state.toTermEditMode(this.#state.nextShowRelation)
  }

  toBlockEditMode() {
    this.hidePallet()
    this.#state.toBlockEditMode(this.#state.nextShowRelation)
  }

  toRelationEditMode() {
    this.hidePallet()
    this.#state.toRelationEditMode()
  }

  toggleSimpleMode() {
    this.hidePallet()
    this.#state.toggleSimpleMode()
  }

  changeModeByShortcut() {
    this.hidePallet()
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
      this.#state.toTermEditMode(this.#annotationModel.relation.some)
      return
    }

    if (this.#startUpOptions.isEditBlockMode) {
      this.#state.toBlockEditMode(this.#annotationModel.relation.some)
      return
    }

    if (this.#startUpOptions.isEditRelationMode) {
      this.#state.toRelationEditMode()
      return
    }

    this.#state.toViewMode(this.#annotationModel.relation.some)
  }

  hidePallet() {
    this.currentMode.hidePallet()
  }

  get isTypeValuesPalletShown() {
    return this.currentMode.isPalletShown
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
        return this.#termEditMode
      case MODE.EDIT_BLOCK:
        return this.#blockEditMode
      case MODE.EDIT_RELATION:
        return this.#relationEditMode
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
          applyTextSelectionWithTouchDevice() {},
          hidePallet() {},
          get isPalletShown() {
            return false
          }
        }
    }
  }
}
