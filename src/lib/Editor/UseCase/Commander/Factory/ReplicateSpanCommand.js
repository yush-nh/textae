import CreateDenotationSpanAndTypesCommand from './CreateDenotationSpanAndTypesCommand'
import CompositeCommand from './CompositeCommand'

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
        return new CreateDenotationSpanAndTypesCommand(
          annotationModel,
          selectionModel,
          editorID,
          begin,
          end,
          typeValuesList
        )
      })
    this._logMessage = `from span: ${span.id}`
  }
}
