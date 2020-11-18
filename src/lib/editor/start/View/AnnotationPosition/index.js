import arrangeDenotionEntityPosition from './arrangeDenotionEntityPosition'
import arrangeBlockEntityPosition from './arrangeBlockEntityPosition'

export default class AnnotationPosition {
  constructor(editor, annotationData, textBox, gridRectangle, renderer) {
    this._editor = editor
    this._annotationData = annotationData
    this._textBox = textBox
    this._gridRectangle = gridRectangle
    this._renderer = renderer
  }

  async update() {
    this._editor.eventEmitter.emit(
      'textae.annotationPosition.position-update.start'
    )

    arrangeDenotionEntityPosition(this._annotationData, this._gridRectangle)

    // When you undo the deletion of a block span,
    // if you move the background first, the grid will move to a better position.
    this._annotationData.span.arrangeBackgroundOfBlockSpanPosition(
      this._textBox
    )
    arrangeBlockEntityPosition(
      this._annotationData,
      this._textBox,
      this._gridRectangle
    )

    await this._renderer.arrangeRelationPositionAllAsync()
    this._editor.eventEmitter.emit(
      'textae.annotationPosition.position-update.end'
    )
  }
}
