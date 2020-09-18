import AnnotationCommand from '../../AnnotationCommand'
import commandLog from '../../commandLog'
import RevertMoveEntitiesCommand from './RevertMoveEntitiesCommand'

export default class extends AnnotationCommand {
  constructor(annotationData, span, entities) {
    super()

    this._annotationData = annotationData
    this._span = span
    this._entities = entities
  }

  execute() {
    // Save move map to revert this command.
    this._moveMap = this._entities.reduce((map, entity) => {
      const span = this._annotationData.span.get(entity.span)

      if (map.has(span)) {
        map.get(span).push(entity)
      } else {
        map.set(span, [entity])
      }
      return map
    }, new Map())

    const message = `move entities: ${Array.from(this._moveMap.entries())
      .map(([_, entities]) => {
        return `${entities.map((e) => e.id).join(', ')} from ${
          entities[0].span
        } to ${this._span.id}`
      })
      .join(', ')}`

    this._annotationData.entity.moveEntities(this._span.id, this._entities)

    commandLog(message)
  }

  revert() {
    return new RevertMoveEntitiesCommand(this._annotationData, this._moveMap)
  }
}
