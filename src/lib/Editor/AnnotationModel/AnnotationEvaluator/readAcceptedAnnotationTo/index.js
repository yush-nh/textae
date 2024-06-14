import IDConflictResolver from './IDConflictResolver'
import convertBeginAndEndOfSpanToInteger from './convertBeginAndEndOfSpanToInteger'

export default function (
  spanInstanceContainer,
  entityInstanceContainer,
  attributeInstanceContainer,
  relationInstanceContainer,
  accept,
  trackNumber = ''
) {
  const [typeSettings, denotation, block] = convertBeginAndEndOfSpanToInteger(
    accept.typeSetting,
    accept.denotation,
    accept.block
  )
  const { relation, attribute } = accept
  const { denotations, blocks, relations, attributes } = new IDConflictResolver(
    trackNumber
  ).addTrackNumberAsIDPrefix(denotation, block, relation, attribute)

  spanInstanceContainer.addSource(typeSettings, 'typesetting')
  spanInstanceContainer.addSource(denotations, 'denotation')
  spanInstanceContainer.addSource(blocks, 'block')
  entityInstanceContainer.addSource(denotations, 'denotation')
  entityInstanceContainer.addSource(blocks, 'block')
  relationInstanceContainer.addSource(relations)
  attributeInstanceContainer.addSource(attributes)
}
