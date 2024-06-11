import PositionsOnAnnotation from './SelectionWrapper/PositionsOnAnnotation'

export default function (
  sourceDoc,
  spanModelContainer,
  spanAdjuster,
  spanConfig
) {
  const { begin, end } = new PositionsOnAnnotation(spanModelContainer)

  return {
    begin: spanAdjuster.backFromBegin(sourceDoc, begin, spanConfig),
    end: spanAdjuster.forwardFromEnd(sourceDoc, end - 1, spanConfig) + 1
  }
}
