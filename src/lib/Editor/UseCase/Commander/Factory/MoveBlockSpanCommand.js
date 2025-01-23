import commandLog from './commandLog'
import AnnotationCommand from './AnnotationCommand'

export default class MoveBlockSpanCommand extends AnnotationCommand {
  #spanInstanceContainer
  #spanID
  #begin
  #end
  #newID
  #beginBeforeMove
  #endBeforeMove

  constructor(spanInstanceContainer, spanID, begin, end) {
    super()
    this.#spanInstanceContainer = spanInstanceContainer
    this.#spanID = spanID
    this.#begin = begin
    this.#end = end
  }

  execute() {
    // Update instance.
    const { id, begin, end } = this.#spanInstanceContainer.moveBlockSpan(
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
    return new MoveBlockSpanCommand(
      this.#spanInstanceContainer,
      this.#newID,
      this.#beginBeforeMove,
      this.#endBeforeMove
    )
  }
}
