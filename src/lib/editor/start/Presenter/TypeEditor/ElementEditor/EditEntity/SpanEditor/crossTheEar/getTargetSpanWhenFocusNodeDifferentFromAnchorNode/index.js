import isFocusInSelectedSpan from '../../isFocusInSelectedSpan'
import isForcusOneDownUnderAnchor from './isForcusOneDownUnderAnchor'

export default function(annotationData, selectionModel, selectionWrapper) {
  if (isFocusInSelectedSpan(annotationData, selectionModel, selectionWrapper)) {
    // If a span is selected, it is able to begin drag out of an outer span of the span and shrink the span.
    // The focus node should be at the selected node.
    // cf.
    // 1. Select an inner span.
    // 2. Begin Drug from out of an outside span to the selected span.
    // Shrink the selected span.
    return selectionModel.span.singleId
  } else if (isForcusOneDownUnderAnchor(selectionWrapper.selection)) {
    // To shrink the span , belows are needed:
    // 1. The anchorNode out of the span and in the parent of the span.
    // 2. The foucusNode is in the span.
    return selectionWrapper.selection.focusNode.parentNode.id
  }

  return null
}
