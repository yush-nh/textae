import alertifyjs from 'alertifyjs'

/**
 *
 * @param {import('../../../../../AnnotationModel/SpanInstanceContainer').default} spanInstanceContainer
 * @returns
 */
export default function (spanInstanceContainer, begin, end) {
  // The span cross exists spans.
  if (spanInstanceContainer.isBoundaryCrossingWithOtherSpans(begin, end)) {
    alertifyjs.warning('A span cannot be modified to make a boundary crossing.')
    return false
  }

  // The span exists already.
  if (spanInstanceContainer.hasDenotationSpan(begin, end)) {
    return false
  }

  // There is a BlockSpan that is a child.
  if (spanInstanceContainer.hasBlockSpanBetween(begin, end)) {
    return false
  }

  return true
}
