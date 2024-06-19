import { makeDenotationSpanHTMLElementID } from '../../../idFactory'
import { CreateCommand } from './commandTemplate'
import CompositeCommand from './CompositeCommand'
import CreateEntityAndAttributesCommand from './CreateEntityAndAttributesCommand'

export default class CreateSpanAndTypesCommand extends CompositeCommand {
  constructor(
    annotationModel,
    selectionModel,
    editorID,
    begin,
    end,
    typeValuesList
  ) {
    super()

    const spanID = makeDenotationSpanHTMLElementID(editorID, begin, end)

    this._subCommands = [
      new CreateCommand(
        annotationModel,
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
          new CreateEntityAndAttributesCommand(
            annotationModel,
            selectionModel,
            spanID,
            typeValues.typeName,
            typeValues.attributes
          )
      )
    )
    this._logMessage = `span: ${spanID}, types: ${typeValuesList
      .map(({ typeName }) => typeName)
      .join(', ')}`
  }
}
