import setEditableStyle from './setEditableStyle'
import ViewMode from './ViewMode'

const TERM = 'term'
const INSTANCE = 'instance'
const RELATION = 'relation'

export default class {
  constructor(editor, typeEditor, displayInstance) {
    this._editor = editor
    this._typeEditor = typeEditor
    this._viewMode = new ViewMode(editor)
    this._displayInstance = displayInstance
  }

  toTerm() {
    this._displayInstance.hide()
    this._editor.eventEmitter.emit('textae.editMode.transition', TERM, true)

    this._typeEditor.editEntity()
    this._viewMode.setTerm()
    setEditableStyle(this._editor, true)
  }

  toInstance() {
    this._displayInstance.show()
    this._editor.eventEmitter.emit('textae.editMode.transition', INSTANCE, true)

    this._typeEditor.editEntity()
    this._viewMode.setInstance()
    setEditableStyle(this._editor, true)
  }

  toRelation() {
    this._displayInstance.show()
    this._editor.eventEmitter.emit('textae.editMode.transition', RELATION, true)

    this._typeEditor.editRelation()
    this._viewMode.setRelation()
    setEditableStyle(this._editor, true)
  }

  toViewTerm() {
    this._displayInstance.hide()
    this._editor.eventEmitter.emit('textae.editMode.transition', TERM, false)

    this._typeEditor.noEdit()
    this._viewMode.setTerm()
    setEditableStyle(this._editor, false)
  }

  toViewInstance() {
    this._displayInstance.show()
    this._editor.eventEmitter.emit(
      'textae.editMode.transition',
      INSTANCE,
      false
    )

    this._typeEditor.noEdit()
    this._viewMode.setInstance()
    setEditableStyle(this._editor, false)
  }
}
