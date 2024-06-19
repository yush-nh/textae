import { CreateCommand } from '../commandTemplate'
import CompositeCommand from '../CompositeCommand'
import CreateAttributeToTheLatestEntityCommand from './CreateAttributeToTheLatestEntityCommand'

export default class CreateEntityAndAttributesCommand extends CompositeCommand {
  constructor(annotationModel, selectionModel, spanID, typeName, attributes) {
    super()

    this._subCommands = [
      new CreateCommand(
        annotationModel,
        'entity',
        {
          spanID,
          typeName
        },
        selectionModel
      )
    ].concat(
      attributes.map(
        ({ obj, pred }) =>
          // Only one entity was created.
          new CreateAttributeToTheLatestEntityCommand(
            annotationModel,
            obj,
            pred
          )
      )
    )

    this._logMessage = `span: ${spanID}, type: ${typeName}${
      attributes.length
        ? `, attributes: ${attributes.map(({ pred }) => pred).join(', ')}`
        : ''
    }`
  }
}
