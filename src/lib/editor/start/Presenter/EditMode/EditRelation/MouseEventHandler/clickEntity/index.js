import createRelation from './createRelation'
import updateSelectionOfEntity from './updateSelectionOfEntity'

export default function (
  selectionModel,
  entityId,
  commander,
  typeDefinition,
  event
) {
  if (!selectionModel.entity.some) {
    selectionModel.selectEntity(entityId)
  } else {
    const subjectEntityId = selectionModel.entity.singleId
    const objectEntityId = entityId

    // Cannot make a self reference relation.
    if (subjectEntityId === objectEntityId) {
      selectionModel.entity.toggle(subjectEntityId)
    } else {
      createRelation(commander, subjectEntityId, objectEntityId, typeDefinition)
      updateSelectionOfEntity(
        event,
        selectionModel.entity,
        subjectEntityId,
        objectEntityId
      )
    }
  }
}
