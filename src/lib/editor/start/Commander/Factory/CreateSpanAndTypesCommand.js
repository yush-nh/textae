import { CreateCommand } from './commandTemplate'
import CompositeCommand from './CompositeCommand'
import CreateEntityCommand from './CreateEntityCommand'

export default class CreateSpanAndTypesCommand extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    selectionModel,
    spanId,
    begin,
    end,
    typeValuesList
  ) {
    super()

    this._subCommands = [
      new CreateCommand(
        editor,
        annotationData,
        'span',
        {
          begin,
          end
        },
        selectionModel
      )
    ].concat(
      typeValuesList.map(
        (typeValues) =>
          new CreateEntityCommand(
            editor,
            annotationData,
            selectionModel,
            spanId,
            typeValues.typeName,
            typeValues.attributes
          )
      )
    )
    this._logMessage = `create a span ${spanId}`
  }
}
