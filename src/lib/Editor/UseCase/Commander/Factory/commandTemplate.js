import commandLog from './commandLog'
import AnnotationCommand from './AnnotationCommand'

class CreateCommand extends AnnotationCommand {
  #annotationModel
  #annotationType
  #instance
  #selectionModel

  constructor(
    annotationModel,
    annotationType,
    instance,
    selectionModel = null
  ) {
    super()
    this.#annotationModel = annotationModel
    this.#annotationType = annotationType
    this.#instance = instance
    this.#selectionModel = selectionModel
  }

  execute() {
    this.#instance = this.#annotationModel
      .getInstanceContainerFor(this.#annotationType)
      .add(this.#instance)

    if (this.#selectionModel) {
      this.#selectionModel.add(this.#annotationType, [this.#instance.id])
    }

    commandLog(this, `${this.#annotationType}: ${this.#instance.id}`)
  }

  revert() {
    return new RemoveCommand(
      this.#annotationModel,
      this.#annotationType,
      this.#instance
    )
  }
}

class RemoveCommand extends AnnotationCommand {
  constructor(annotationModel, annotationType, instance) {
    super()
    this._annotationModel = annotationModel
    this._annotationType = annotationType
    this._instance = instance
  }

  execute() {
    this._annotationModel
      .getInstanceContainerFor(this._annotationType)
      .remove(this._instance.id)

    commandLog(this, `${this._annotationType}: ${this._instance.id}`)
  }

  revert() {
    return new CreateCommand(
      this._annotationModel,
      this._annotationType,
      this._instance
    )
  }
}

export { CreateCommand, RemoveCommand }
