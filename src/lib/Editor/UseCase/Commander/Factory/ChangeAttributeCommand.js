import AnnotationCommand from './AnnotationCommand'
import commandLog from './commandLog'

export default class ChangeAttributeCommand extends AnnotationCommand {
  #annotationModel
  #attribute
  #oldPred
  #oldObj
  #newPred
  #newObj
  #newInstance

  constructor(annotationModel, attribute, newPred, newObj) {
    super()
    this.#annotationModel = annotationModel
    this.#attribute = attribute
    this.#oldPred = attribute.pred
    this.#oldObj = attribute.obj
    this.#newPred = newPred
    this.#newObj = newObj
  }

  execute() {
    this.#newInstance = this.#annotationModel.attributeInstanceContainer.change(
      this.#attribute.id,
      this.#newPred,
      this.#newObj
    )

    commandLog(
      this,
      `attribute: ${this.#attribute.id} changed from ${this.#oldPred}:${this.#oldObj} to ${this.#newInstance.pred}:${this.#newInstance.obj}.`
    )
  }

  revert() {
    return new ChangeAttributeCommand(
      this.#annotationModel,
      this.#newInstance,
      this.#oldPred,
      this.#oldObj
    )
  }
}
