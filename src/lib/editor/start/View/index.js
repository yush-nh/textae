import CursorChanger from '../../../util/CursorChanger'
import AnnotationPosition from './AnnotationPosition'
import bindClipBoardEvents from './bindClipBoardEvents'
import bindAnnotaitonPositionEvents from './bindAnnotaitonPositionEvents'
import Renderer from './Renderer'
import bindAnnotationDataEvents from './bindAnnotationDataEvents'
import HoverRelation from './HoverRelation'
import bindMouseEvents from './bindMouseEvents'
import TextBox from './TextBox'
import GridRectangle from './GridRectangle'
import updateAllTypeGaps from './bindEntityGapEvents/updateAllTypeGaps'

export default class View {
  constructor(
    editor,
    annotationData,
    selectionModel,
    entityGap,
    typeDefinition
  ) {
    // Place the text box behind the annotation box to allow you
    // to select the text behind the relationship label in entity editing mode.
    const html = `
    <div class="textae-editor__body">
      <div class="textae-editor__body__annotation-box"></div>
      <div class="textae-editor__body__text-box" id="${editor.editorId}_text-box"></div>
    </div>
    `
    // The editor itself has a "white-space: pre" style for processing text that contains a series of whitespace.
    // In this case, HTML line breaks are included in the editor's height calculation.
    // Remove CRLF so that it is not included in the height calculation.
    editor[0].innerHTML = html.replace(/[\n\r]+/g, '')

    this._textBox = new TextBox(
      editor[0].querySelector('.textae-editor__body__text-box'),
      annotationData
    )
    this._gridRectangle = new GridRectangle(annotationData, entityGap)

    const renderer = new Renderer(
      editor,
      annotationData,
      selectionModel,
      typeDefinition,
      entityGap,
      this._textBox,
      this._gridRectangle
    )
    this._annotationPosition = new AnnotationPosition(
      editor,
      annotationData,
      this._textBox,
      this._gridRectangle,
      renderer
    )

    entityGap.bind((newValue) => {
      updateAllTypeGaps(annotationData, newValue)
      this._textBox.updateLineHeight(this._gridRectangle)
      this._annotationPosition.update()
    })

    bindClipBoardEvents(editor)
    bindAnnotationDataEvents(
      editor,
      this._annotationPosition,
      this._textBox,
      this._gridRectangle
    )
    bindAnnotaitonPositionEvents(editor, new CursorChanger(editor))
    bindMouseEvents(editor, new HoverRelation(editor, annotationData.entity))
  }

  updateDisplay() {
    this._textBox.forceUpdate()
    this._annotationPosition.update()
  }

  updateLineHeight() {
    this._textBox.updateLineHeight(this._gridRectangle)
    this._annotationPosition.update()
  }

  getLineHeight() {
    return this._textBox.lineHeight
  }

  setLineHeight(value) {
    this._textBox.lineHeight = value
  }
}
