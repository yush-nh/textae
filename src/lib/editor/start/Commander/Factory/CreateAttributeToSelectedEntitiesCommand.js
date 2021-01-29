import CompositeCommand from './CompositeCommand'
import getCreateAttributeToSelectedEntitiesCommands from './getCreateAttributeToItemsCommands'

export default class CreateAttributeToSelectedEntitiesCommand extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    selectionModel,
    attributeDefinition,
    obj
  ) {
    super()

    this._subCommands = getCreateAttributeToSelectedEntitiesCommands(
      editor,
      annotationData,
      selectionModel,
      selectionModel.entity.all,
      attributeDefinition.pred,
      obj || attributeDefinition.default
    )

    this._logMessage = `create attirbute ${attributeDefinition.pred}:${
      attributeDefinition.default
    } to entity ${selectionModel.entity.all
      .map((entity) => entity.id)
      .join(', ')}`
  }
}
