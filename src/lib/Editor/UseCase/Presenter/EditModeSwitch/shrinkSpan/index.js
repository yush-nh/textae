import getRightSpanElement from '../../../../getRightSpanElement'
import shrinkSpanToSelection from './shrinkSpanToSelection'

export default function (
  editorHTMLElement,
  spanInstanceContainer,
  sourceDoc,
  selectionModel,
  commander,
  spanAdjuster,
  spanId,
  spanConfig,
  moveHandler
) {
  if (spanId) {
    selectionModel.removeAll()

    // Get the next span before removing the old span.
    const nextSpan = getRightSpanElement(editorHTMLElement, spanId)
    const removed = shrinkSpanToSelection(
      spanInstanceContainer,
      sourceDoc,
      commander,
      spanAdjuster,
      spanId,
      spanConfig,
      moveHandler
    )

    if (removed && nextSpan) {
      selectionModel.selectSpan(nextSpan.id)
    }
  }
}
