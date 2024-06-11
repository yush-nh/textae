import PositionsOnAnnotation from './SelectionWrapper/PositionsOnAnnotation'

// A span cannot be created include nonEdgeCharacters only.
export default function (
  sourceDoc,
  spanModelContainer,
  spanConfig,
  positionsOnAnnotation
) {
  const { begin, end } = new PositionsOnAnnotation(spanModelContainer)
  const selectedString = sourceDoc.substring(begin, end)

  return spanConfig.removeBlankCharacters(selectedString).length > 0
}
