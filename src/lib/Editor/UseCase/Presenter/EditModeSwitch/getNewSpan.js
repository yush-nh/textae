export default function (
  sourceDoc,
  spanAdjuster,
  selectionWrapper,
  spanConfig
) {
  const { positionsOnAnnotation } = selectionWrapper

  return {
    begin: spanAdjuster.backFromBegin(
      sourceDoc,
      positionsOnAnnotation.begin,
      spanConfig
    ),
    end:
      spanAdjuster.forwardFromEnd(
        sourceDoc,
        positionsOnAnnotation.end - 1,
        spanConfig
      ) + 1
  }
}
