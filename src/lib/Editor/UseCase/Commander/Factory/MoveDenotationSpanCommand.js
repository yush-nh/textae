import commandLog from './commandLog'
import AnnotationCommand from './AnnotationCommand'

export default class MoveDenotationSpanCommand extends AnnotationCommand {
  #annotationModel
  #spanId
  #begin
  #end
  #newId
  #oldBegin
  #oldEnd

  constructor(annotationModel, spanId, begin, end) {
    super()
    this.#annotationModel = annotationModel
    this.#spanId = spanId
    this.#begin = begin
    this.#end = end
  }

  execute() {
    // Update instance.
    const { id, begin, end } =
      this.#annotationModel.spanInstanceContainer.moveDenotationSpan(
        this.#spanId,
        this.#begin,
        this.#end
      )

    this.#newId = id
    this.#oldBegin = begin
    this.#oldEnd = end

    commandLog(
      this,
      `move span: ${this.#spanId} to {begin: ${this.#begin}, end: ${this.#end}}`
    )
  }

  revert() {
    return new MoveDenotationSpanCommand(
      this.#annotationModel,
      this.#newId,
      this.#oldBegin,
      this.#oldEnd
    )
  }
}
