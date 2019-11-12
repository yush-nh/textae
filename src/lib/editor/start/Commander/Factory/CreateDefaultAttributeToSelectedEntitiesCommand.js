import CompositeCommand from './CompositeCommand'
import { CreateCommand } from './commandTemplate'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, typeDefinition, number) {
    super()

    const entities = selectionModel.entity.all
    const { pred, obj } = typeDefinition.entity.getAttributeAt(number)

    this._subCommands = entities
      .filter((entityId) =>
        // An entity cannot have more than one attribute with the same predicate.
        annotationData.entity
          .get(entityId)
          .type.withoutSamePredicateAttribute(pred)
      )
      .map((subj) => {
        return new CreateCommand(
          editor,
          annotationData,
          selectionModel,
          'attribute',
          false,
          {
            id: null,
            subj,
            pred,
            obj
          }
        )
      })
    this._logMessage = `create attirbute ${pred}:${obj} to entity ${entities.join(
      ', '
    )}`
  }
}
