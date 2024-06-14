import commandLog from './commandLog'
import AnnotationCommand from './AnnotationCommand'

export default class MoveBlockSpanCommand extends AnnotationCommand {
  #annotationModel
  #spanID
  #begin
  #end
  #newID
  #beginBeforeMove
  #endBeforeMove

  constructor(annotationModel, spanID, begin, end) {
    super()
    this.#annotationModel = annotationModel
    this.#spanID = spanID
    this.#begin = begin
    this.#end = end
  }

  execute() {
    // Update instance.
    const { id, begin, end } =
      this.#annotationModel.spanInstanceContainer.moveBlockSpan(
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
      this.#annotationModel,
      this.#newID,
      this.#beginBeforeMove,
      this.#endBeforeMove
    )
  }
}
