import { RemoveCommand } from './commandTemplate'

export default function (editor, annotationData, items, pred) {
  return items
    .reduce((attrs, entity) => attrs.concat(entity.attributes), [])
    .filter((a) => a.pred === pred)
    .map((a) => new RemoveCommand(editor, annotationData, 'attribute', a.id))
}
