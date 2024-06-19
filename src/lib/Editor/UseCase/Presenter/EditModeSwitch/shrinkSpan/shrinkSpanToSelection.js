import alertifyjs from 'alertifyjs'

/**
 *
 * @param {import('../../../../AnnotationModel/SpanInstanceContainer').default} spanInstanceContainer
 */
export default function (
  spanInstanceContainer,
  sourceDoc,
  commander,
  textSelectionAdjuster,
  spanId,
  spanConfig,
  moveHandler
) {
  const { begin, end } = spanInstanceContainer
    .get(spanId)
    .getShortenInAnchorNodeToFocusNodeDirection(
      textSelectionAdjuster,
      sourceDoc,
      spanInstanceContainer,
      spanConfig
    )

  // The span cross exists spans.
  if (spanInstanceContainer.isBoundaryCrossingWithOtherSpans(begin, end)) {
    alertifyjs.warning('A span cannot be shrunken to make a boundary crossing.')
    return false
  }

  const doesExists = spanInstanceContainer.find('denotation', begin, end)

  if (begin < end && !doesExists) {
    moveHandler(begin, end)
  } else {
    commander.invoke(commander.factory.removeSpanCommand(spanId))
    return true
  }

  return false
}
