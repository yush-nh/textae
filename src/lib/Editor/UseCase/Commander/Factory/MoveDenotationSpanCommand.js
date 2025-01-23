import commandLog from './commandLog'
import AnnotationCommand from './AnnotationCommand'

export default class MoveDenotationSpanCommand extends AnnotationCommand {
  /** @type {import('../../../AnnotationModel').default} */
  #spanInstanceContainer
  #spanID
  #begin
  #end
  #newID
  #beginBeforeMove
  #endBeforeMove

  constructor(spanInstanceContainer, spanID, beginAfterMove, endAfterMove) {
    super()
    this.#spanInstanceContainer = spanInstanceContainer
    this.#spanID = spanID
    this.#begin = beginAfterMove
    this.#end = endAfterMove
  }

  execute() {
    // Update instance.
    const { id, begin, end } = this.#spanInstanceContainer.moveDenotationSpan(
      this.#spanID,
      this.#begin,
      this.#end
    )

    this.#newID = id
    this.#beginBeforeMove = begin
    this.#endBeforeMove = end

    commandLog(
      this,
      `move span: ${this.#spanID} to {begin: ${this.#begin}, end: ${this.#end}}`
    )
  }

  revert() {
    return new MoveDenotationSpanCommand(
      this.#spanInstanceContainer,
      this.#newID,
      this.#beginBeforeMove,
      this.#endBeforeMove
    )
  }
}
