import PositionsOnAnnotation from './SelectionWrapper/PositionsOnAnnotation'

// A span cannot be created include nonEdgeCharacters only.
export default function (annotationModel, spanConfig) {
  const { sourceDoc, span } = annotationModel
  const { begin, end } = new PositionsOnAnnotation(span)
  const selectedString = sourceDoc.substring(begin, end)

  return spanConfig.removeBlankCharacters(selectedString).length > 0
}
