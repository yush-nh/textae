import CompositeCommand from './CompositeCommand'
import TypeDefinitionCreateCommand from './TypeDefinitionCreateCommand'
import TypeDefinitionChangeCommand from './TypeDefinitionChangeCommand'
import ChangeTypeRemoveRelationOfSelectedEntitiesCommand from './ChangeTypeRemoveRelationOfSelectedEntitiesCommand'

export default class extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    selectionModel,
    label,
    value,
    typeContainer
  ) {
    super()

    const commands = []
    if (label) {
      const oldType = typeContainer.get(value)
      if (!oldType.id) {
        commands.push(
          new TypeDefinitionCreateCommand(editor, typeContainer, {
            id: value,
            label
          })
        )
      } else if (oldType.label !== label) {
        commands.push(
          new TypeDefinitionChangeCommand(
            editor,
            annotationData,
            typeContainer,
            'entity',
            value,
            new Map([['label', label]])
          )
        )
      }
    }

    const changeEntityCommand = new ChangeTypeRemoveRelationOfSelectedEntitiesCommand(
      editor,
      annotationData,
      selectionModel,
      value,
      typeContainer.isBlock(value)
    )
    if (!changeEntityCommand.isEmpty) {
      commands.push(changeEntityCommand)
    }

    this._subCommands = commands
    this._logMessage = `change entity value: ${value} label: ${label} `
  }
}
