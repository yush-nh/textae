import ChangeTextCommand from './ChangeTextCommand'
import CompositeCommand from './CompositeCommand'

export default class ChangeTextAndMoveSpanCommand extends CompositeCommand {
  constructor(annotationModel, begin, end, newText) {
    super()

    this._isExecuteSubCommandsInReverseOrderWhenRevert = false

    this._subCommands = [
      new ChangeTextCommand(annotationModel, { begin, end }, newText)
    ]

    this._logMessage = `change text from ${begin} to ${end} to ${newText}`
  }
}
