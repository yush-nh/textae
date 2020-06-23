import isNodeParagraph from '../../../../isNodeParagraph'
import isNodeSpan from '../../../../isNodeSpan'

export default function(paragraph, span, node) {
  const parent = node.parentElement
  if (isNodeParagraph(parent)) {
    return paragraph.get(parent.id)
  }
  if (isNodeSpan(parent)) {
    return span.get(parent.id)
  }
  throw new Error(`Can not get position of a node : ${node} ${node.data}`)
}
