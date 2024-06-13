export default function getNewSpan(annotationModel, spanConfig, spanAdjuster) {
  const { sourceDoc, textSelection } = annotationModel
  const { begin, end } = textSelection

  return {
    begin: spanAdjuster.backFromBegin(sourceDoc, begin, spanConfig),
    end: spanAdjuster.forwardFromEnd(sourceDoc, end - 1, spanConfig) + 1
  }
}
