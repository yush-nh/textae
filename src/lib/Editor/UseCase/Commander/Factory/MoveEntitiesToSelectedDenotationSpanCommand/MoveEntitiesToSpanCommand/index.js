import AnnotationCommand from '../../AnnotationCommand'
import commandLog from '../../commandLog'
import RevertMoveEntitiesCommand from './RevertMoveEntitiesCommand'

export default class MoveEntitiesToSpanCommand extends AnnotationCommand {
  constructor(annotationModel, span, entities) {
    super()

    this._annotationModel = annotationModel
    this._span = span
    this._entities = entities
  }

  execute() {
    // Save move map to revert this command.
    this._moveMap = this._entities.reduce((map, entity) => {
      if (map.has(entity.span)) {
        map.get(entity.span).push(entity)
      } else {
        map.set(entity.span, [entity])
      }
      return map
    }, new Map())

    const message = `${Array.from(this._moveMap.entries())
      .map(([_, entities]) => {
        return `${entities.map((e) => e.id).join(', ')} from ${
          entities[0].span.id
        } to ${this._span.id}`
      })
      .join(', ')}`

    this._annotationModel.entityInstanceContainer.moveEntities(
      this._span,
      this._entities
    )

    commandLog(this, message)
  }

  revert() {
    return new RevertMoveEntitiesCommand(this._annotationModel, this._moveMap)
  }
}
