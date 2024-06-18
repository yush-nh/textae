import ChangeTextCommand from './ChangeTextCommand'
import CompositeCommand from './CompositeCommand'
import MoveDenotationSpanCommand from './MoveDenotationSpanCommand'

export default class ChangeTextAndMoveSpanCommand extends CompositeCommand {
  constructor(annotationModel, begin, end, newText) {
    super()

    this._subCommands = [
      new ChangeTextCommand(annotationModel, { begin, end }, newText)
    ]

    const offset = newText.length - (end - begin)
    for (const span of annotationModel.spanInstanceContainer
      .allDenotationSpans) {
      if (span.end <= begin) {
        // No effect on the span of this section.
        continue
      } else if (span.end <= end) {
        // Span movement in this section is prohibited.
        continue
      } else if (end < span.begin) {
        // Change both the begin and end of the span
        this._subCommands.push(
          new MoveDenotationSpanCommand(
            annotationModel,
            span.id,
            span.begin + offset,
            span.end + offset
          )
        )
      } else {
        // Change the end of the span
        this._subCommands.push(
          new MoveDenotationSpanCommand(
            annotationModel,
            span.id,
            begin,
            span.end + offset
          )
        )
      }
    }

    this._logMessage = `change text from ${begin} to ${end} to ${newText}`
  }
}
