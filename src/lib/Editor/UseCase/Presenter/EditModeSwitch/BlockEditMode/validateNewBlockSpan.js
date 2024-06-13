import alertifyjs from 'alertifyjs'

export default function (spanInstanceContainer, begin, end, spanID) {
  // The span cross exists spans.
  if (spanInstanceContainer.isBoundaryCrossingWithOtherSpans(begin, end)) {
    alertifyjs.warning('A span cannot be modifyed to make a boundary crossing.')
    return false
  }

  if (spanInstanceContainer.doesParentOrSameSpanExist(begin, end)) {
    return false
  }

  // There is a BlockSpan that is a child.
  if (
    spanInstanceContainer.hasBlockSpanBetween(begin, end, {
      excluded: spanID
    })
  ) {
    return false
  }

  return true
}
