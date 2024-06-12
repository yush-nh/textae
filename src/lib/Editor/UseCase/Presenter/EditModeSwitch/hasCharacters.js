// A span cannot be created include nonEdgeCharacters only.
export default function (annotationModel, spanConfig) {
  const { sourceDoc, spanInstanceContainer } = annotationModel
  const { begin, end } = spanInstanceContainer.textSelection
  const selectedString = sourceDoc.substring(begin, end)

  return spanConfig.removeBlankCharacters(selectedString).length > 0
}
