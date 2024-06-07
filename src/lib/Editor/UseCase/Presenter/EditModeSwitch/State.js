import { MODE } from '../../../../MODE'

export default class State {
  #currentShowRelation
  #currentState
  #relationContainer
  #eventEmitter
  #functionAvailability

  /**
   *
   * @param {import('../../../AnnotationModel/RelationInstanceContainer').RelationInstanceContainer} relationContainer
   * @param {import('./Transition').default} transition
   * @param {import('../../FunctionAvailability').default} functionAvailability
   */
  constructor(relationContainer, eventEmitter, functionAvailability) {
    this.#currentShowRelation = false
    this.#currentState = MODE.INIT

    this.#relationContainer = relationContainer
    this.#eventEmitter = eventEmitter
    this.#functionAvailability = functionAvailability
  }

  get currentState() {
    return this.#currentState
  }

  toViewMode(showRelation) {
    this.#currentShowRelation = showRelation
    this.#currentState = MODE.VIEW
    this.#emit()
  }

  toTermEditMode(showRelation) {
    this.#currentShowRelation = showRelation
    this.#currentState = MODE.EDIT_DENOTATION
    this.#emit()
  }

  toBlockEditMode(showRelation) {
    this.#currentShowRelation = showRelation
    this.#currentState = MODE.EDIT_BLOCK
    this.#emit()
  }

  toRelationEditMode() {
    this.#currentShowRelation = true
    this.#currentState = MODE.EDIT_RELATION
    this.#emit()
  }

  toEditTextMode(showRelation) {
    this.#currentShowRelation = showRelation
    this.#currentState = MODE.EDIT_TEXT
    this.#emit()
  }

  toggleSimpleMode() {
    switch (this.currentState) {
      case MODE.EDIT_DENOTATION:
        this.toTermEditMode(!this.#currentShowRelation)
        break
      case MODE.EDIT_BLOCK:
        this.toBlockEditMode(!this.#currentShowRelation)
        break
      case MODE.EDIT_TEXT:
        this.toEditTextMode(!this.#currentShowRelation)
        break
      case MODE.VIEW:
        this.toViewMode(!this.#currentShowRelation)
        break
      default:
        throw new Error(`Invalid state: ${this.currentState}`)
    }
  }

  changeModeByShortcut() {
    const modes = this.#modesCanBeTransitionedByShortcutKey

    // No mode to change.
    if (modes.length <= 1) {
      return
    }

    const currentIndex = modes.findIndex(
      (mode) => mode.name === this.currentState
    )

    if (currentIndex < modes.length - 1) {
      // Change to the next mode.
      this[modes[currentIndex + 1].funcName](this.nextShowRelation)
    } else {
      // Change to the first mode.
      this[modes[0].funcName](this.nextShowRelation)
    }
  }

  get nextShowRelation() {
    if (this.#currentState === MODE.EDIT_RELATION) {
      return this.#relationContainer.some
    } else {
      return this.#currentShowRelation
    }
  }

  #emit() {
    this.#eventEmitter.emit(
      'textae-event.edit-mode.transition',
      this.#currentState,
      this.#currentShowRelation
    )
  }

  get #modesCanBeTransitionedByShortcutKey() {
    // Shortcut keys do not transition to text edit mode.
    const all = [
      {
        name: MODE.VIEW,
        availabilityName: 'view mode',
        funcName: 'toViewMode'
      },
      {
        name: MODE.EDIT_DENOTATION,
        availabilityName: 'edit term mode',
        funcName: 'toTermEditMode'
      },
      {
        name: MODE.EDIT_BLOCK,
        availabilityName: 'edit block mode',
        funcName: 'toBlockEditMode'
      },
      {
        name: MODE.EDIT_RELATION,
        availabilityName: 'edit relation mode',
        funcName: 'toRelationEditMode'
      }
    ]

    // Look at Function Availability and return the possible transition modes.
    return all.filter((mode) =>
      this.#functionAvailability.isAvailable(mode.availabilityName)
    )
  }
}
