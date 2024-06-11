// A span cannot be created include nonEdgeCharacters only.
export default function (sourceDoc, spanConfig, positionsOnAnnotation) {
  const selectedString = sourceDoc.substring(
    positionsOnAnnotation.begin,
    positionsOnAnnotation.end
  )

  return spanConfig.removeBlankCharacters(selectedString).length > 0
}
