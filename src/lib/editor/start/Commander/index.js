import alertifyjs from 'alertifyjs'
import Factory from './Factory'

// A command is an operation by user that is saved as history, and can undo and redo.
// Users can edit model only via commands.
export default class Commander {
  constructor(editor, annotationData, selectionModel, history) {
    this._editor = editor
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._history = history
  }

  invoke(command) {
    if (command.isEmpty) {
      return
    }

    command.execute()
    this._history.push(command)
  }

  undo() {
    if (this._history.hasAnythingToUndo) {
      // Focus the editor.
      // Focus is lost when undo a creation.
      this._selectionModel.removeAll()
      this._editor.focus()

      const commands = this._history.prev()
      if (commands.kind.has('configuration_command')) {
        alertifyjs.success('configuration has been undone')
      }

      commands.command.revert().execute()
    }
  }

  redo() {
    if (this._history.hasAnythingToRedo) {
      // Select only new element when redo a creation.
      this._selectionModel.removeAll()

      const commands = this._history.next()
      if (commands.kind.has('configuration_command')) {
        alertifyjs.success('configuration has been redo')
      }

      commands.command.execute()
    }
  }

  get factory() {
    return new Factory(
      this._editor,
      this._annotationData,
      this._selectionModel,
      this._annotationData.typeDefinition
    )
  }
}
