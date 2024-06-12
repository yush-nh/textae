export default function (
  sourceDoc,
  spanInstanceContainer,
  spanConfig,
  spanAdjuster
) {
  const { begin, end } = spanInstanceContainer.textSelection

  return {
    begin: spanAdjuster.backFromBegin(sourceDoc, begin, spanConfig),
    end: spanAdjuster.forwardFromEnd(sourceDoc, end - 1, spanConfig) + 1
  }
}
