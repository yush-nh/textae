import { CreateCommand } from './commandTemplate'
import CompositeCommand from './CompositeCommand'
import CreateEntityAndAttributesCommand from './CreateEntityAndAttributesCommand'

export default class CreateBlockCommand extends CompositeCommand {
  constructor(
    editorID,
    annotationModel,
    selectionModel,
    begin,
    end,
    defaultType
  ) {
    super()

    const createSpanCommand = new CreateCommand(
      annotationModel,
      'span',
      {
        begin,
        end,
        isBlock: true
      },
      selectionModel
    )
    const createEntityCommand = new CreateEntityAndAttributesCommand(
      annotationModel,
      selectionModel,
      'block',
      begin,
      end,
      defaultType,
      []
    )

    this._subCommands = [createSpanCommand, createEntityCommand]
    this._logMessage = `create a span ${begin}:${end} with type ${defaultType}`
  }
}
