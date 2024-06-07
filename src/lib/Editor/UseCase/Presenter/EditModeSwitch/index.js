import { MODE } from '../../../../MODE'
import State from './State'
import EditDenotation from './EditDenotation'
import BlockEditMode from './BlockEditMode'
import EditRelation from './EditRelation'
import ModeTransitionReactor from './ModeTransitionReactor'

export default class EditModeSwitch {
  #editDenotation
  #blockEditMode
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

    new ModeTransitionReactor(
      editorHTMLElement,
      eventEmitter,
      annotationModel,
      this.#editDenotation,
      this.#blockEditMode,
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
    this.hidePallet()
    this.#state.toViewMode(this.#state.nextShowRelation)
  }

  toEditTermMode() {
    this.hidePallet()
    this.#state.toEditTermMode(this.#state.nextShowRelation)
  }

  toEditBlockMode() {
    this.hidePallet()
    this.#state.toEditBlockMode(this.#state.nextShowRelation)
  }

  toEditRelationMode() {
    this.hidePallet()
    this.#state.toEditRelationMode()
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
        return this.#editDenotation
      case MODE.EDIT_BLOCK:
        return this.#blockEditMode
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
          applyTextSelectionWithTouchDevice() {},
          hidePallet() {},
          get isPalletShown() {
            return false
          }
        }
    }
  }
}
