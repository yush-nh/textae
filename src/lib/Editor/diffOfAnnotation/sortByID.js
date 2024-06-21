import byID from './byID'

export default function sortByID({
  text,
  denotations = [],
  attributes = [],
  relations = [],
  blocks = []
}) {
  return {
    text,
    denotations: denotations.sort(byID),
    attributes: attributes.sort(byID),
    relations: relations.sort(byID),
    blocks: blocks.sort(byID)
  }
}
