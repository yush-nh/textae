import CreateSpanAndTypesCommand from './CreateSpanAndTypesCommand'
import CompositeCommand from './CompositeCommand'
import { makeDenotationSpanHTMLElementID } from '../../../idFactory'

export default class ReplicateSpanCommand extends CompositeCommand {
  constructor(
    editorID,
    annotationModel,
    selectionModel,
    span,
    typeValuesList,
    isDelimiterFunc
  ) {
    super()

    console.log(span)

    this._subCommands = annotationModel
      .getReplicationRanges(span, isDelimiterFunc)
      .map(({ begin, end }) => {
        const spanId = makeDenotationSpanHTMLElementID(editorID, begin, end)

        return new CreateSpanAndTypesCommand(
          annotationModel,
          selectionModel,
          spanId,
          begin,
          end,
          typeValuesList
        )
      })
    this._logMessage = `from span: ${span.id}`
  }
}
