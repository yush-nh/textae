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

  toEditTermMode(showRelation) {
    this.#currentShowRelation = showRelation
    this.#currentState = MODE.EDIT_DENOTATION
    this.#emit()
  }

  toBlockMode(showRelation) {
    this.#currentShowRelation = showRelation
    this.#currentState = MODE.EDIT_BLOCK
    this.#emit()
  }

  toRelationMode() {
    this.#currentShowRelation = true
    this.#currentState = MODE.EDIT_RELATION
    this.#emit()
  }

  toggleSimpleMode() {
    switch (this.currentState) {
      case MODE.EDIT_DENOTATION:
        this.toEditTermMode(!this.#currentShowRelation)
        break
      case MODE.EDIT_BLOCK:
        this.toBlockMode(!this.#currentShowRelation)
        break
      case MODE.VIEW:
        this.toViewMode(!this.#currentShowRelation)
        break
      default:
        throw new Error(`Invalid state: ${this.currentState}`)
    }
  }

  changeModeByShortcut() {
    const modes = this.#availableModes

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

  // Look at Function Availability and return the possible transition modes.
  get #availableModes() {
    const all = [
      {
        name: MODE.VIEW,
        availabilityName: 'view mode',
        funcName: 'toViewMode'
      },
      {
        name: MODE.EDIT_DENOTATION,
        availabilityName: 'term edit mode',
        funcName: 'toEditTermMode'
      },
      {
        name: MODE.EDIT_BLOCK,
        availabilityName: 'block edit mode',
        funcName: 'toBlockMode'
      },
      {
        name: MODE.EDIT_RELATION,
        availabilityName: 'relation edit mode',
        funcName: 'toRelationMode'
      }
    ]

    return all.filter((mode) =>
      this.#functionAvailability.isAvailable(mode.availabilityName)
    )
  }
}
