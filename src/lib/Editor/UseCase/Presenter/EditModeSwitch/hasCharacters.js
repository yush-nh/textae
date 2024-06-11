// A span cannot be created include nonEdgeCharacters only.
export default function (sourceDoc, spanConfig, orderedPositions) {
  const selectedString = sourceDoc.substring(
    orderedPositions.begin,
    orderedPositions.end
  )

  return spanConfig.removeBlankCharacters(selectedString).length > 0
}
