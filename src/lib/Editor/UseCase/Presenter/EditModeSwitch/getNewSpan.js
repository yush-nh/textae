export default function (
  sourceDoc,
  spanModelContainer,
  spanConfig,
  spanAdjuster
) {
  const { begin, end } = spanModelContainer.positionsOnAnnotation

  return {
    begin: spanAdjuster.backFromBegin(sourceDoc, begin, spanConfig),
    end: spanAdjuster.forwardFromEnd(sourceDoc, end - 1, spanConfig) + 1
  }
}
