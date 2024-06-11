export default function (
  sourceDoc,
  spanAdjuster,
  selectionWrapper,
  spanConfig
) {
  const { orderedPositions } = selectionWrapper

  return {
    begin: spanAdjuster.backFromBegin(
      sourceDoc,
      orderedPositions.begin,
      spanConfig
    ),
    end:
      spanAdjuster.forwardFromEnd(
        sourceDoc,
        orderedPositions.end - 1,
        spanConfig
      ) + 1
  }
}
