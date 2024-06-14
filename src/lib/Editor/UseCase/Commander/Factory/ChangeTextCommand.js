import AnnotationCommand from './AnnotationCommand'
import commandLog from './commandLog'

export default class ChangeTextCommand extends AnnotationCommand {
  #annotationModel
  #begin
  #end
  #newText
  #endAfterChange
  #textBeforeChange

  constructor(annotationModel, targetTextSelection, newText) {
    super()

    this.#annotationModel = annotationModel
    this.#begin = targetTextSelection.begin
    this.#end = targetTextSelection.end
    this.#newText = newText
  }

  execute() {
    this.#endAfterChange = this.#begin + this.#newText.length
    this.#textBeforeChange = this.#annotationModel.sourceDoc.substring(
      this.#begin,
      this.#end
    )

    this.#annotationModel.changeText(this.#begin, this.#end, this.#newText)

    commandLog(
      this,
      `change text at ${this.#begin}:${this.#end} to ${this.#newText}`
    )
  }

  revert() {
    return new ChangeTextCommand(
      this.#annotationModel,
      { begin: this.#begin, end: this.#endAfterChange },
      this.#textBeforeChange
    )
  }
}
