import OrderedPositions from './OrderedPositions'

// A span cannot be created include nonEdgeCharacters only.
export default function (sourceDoc, spanConfig, positionsOnAnnotation) {
  const orderedPositions = new OrderedPositions(positionsOnAnnotation)
  const selectedString = sourceDoc.substring(
    orderedPositions.begin,
    orderedPositions.end
  )

  return spanConfig.removeBlankCharacters(selectedString).length > 0
}
