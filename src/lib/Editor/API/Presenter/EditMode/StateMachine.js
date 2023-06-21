import { MODE } from '../../../../MODE'

export default class StateMachine {
  /**
   *
   * @param {import('../../../AnnotationData/RelationModelContainer').default} relationContainer
   * @param {import('./Transition').default} transition
   */
  constructor(relationContainer, transition) {
    this._relationContainer = relationContainer
    this._currentShowRelation = false
    this._transition = transition
    this._currentState = MODE.INIT
  }

  get currentState() {
    return this._currentState
  }

  setState(state, showRelation) {
    this._currentShowRelation = showRelation

    switch (state) {
      case MODE.VIEW:
        this._currentState = MODE.VIEW
        this._transition.toView(showRelation)
        break

      case MODE.EDIT_DENOTATION:
        this._currentState = MODE.EDIT_DENOTATION
        this._transition.toEditDenotation(showRelation)
        break

      case MODE.EDIT_BLOCK:
        this._currentState = MODE.EDIT_BLOCK
        this._transition.toEditBlock(showRelation)
        break

      default:
        throw new Error(`Invalid state: ${state}`)
    }
  }

  toViewMode(showRelation) {
    this.setState(MODE.VIEW, showRelation)
  }

  toTermMode(showRelation) {
    this.setState(MODE.EDIT_DENOTATION, showRelation)
  }

  toBlockMode(showRelation) {
    this.setState(MODE.EDIT_BLOCK, showRelation)
  }

  toRelationMode() {
    this._currentState = MODE.EDIT_RELATION
    this._transition.toEditRelation()
  }

  toggleSimpleMode() {
    switch (this.currentState) {
      case MODE.EDIT_DENOTATION:
        this.setState(MODE.EDIT_DENOTATION, !this._currentShowRelation)
        break
      case MODE.EDIT_BLOCK:
        this.setState(MODE.EDIT_BLOCK, !this._currentShowRelation)
        break
      case MODE.VIEW:
        this.setState(MODE.VIEW, !this._currentShowRelation)
        break
      default:
        throw new Error(`Invalid state: ${this.currentState}`)
    }
  }

  changeModeByShortcut() {
    switch (this.currentState) {
      case MODE.VIEW:
        this.setState(MODE.EDIT_DENOTATION, this.nextShowRelation)
        break
      case MODE.EDIT_DENOTATION:
        this.setState(MODE.EDIT_BLOCK, this.nextShowRelation)
        break
      case MODE.EDIT_BLOCK:
        this.toRelationMode()
        break
      case MODE.EDIT_RELATION:
        this.setState(MODE.VIEW, this.nextShowRelation)
        break
      default:
      // Do nothing.
    }
  }

  get nextShowRelation() {
    if (this._currentState === MODE.EDIT_RELATION) {
      return this._relationContainer.some
    } else {
      return this._currentShowRelation
    }
  }
}
