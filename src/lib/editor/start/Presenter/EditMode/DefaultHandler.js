export default class DefaultHandler {
  constructor(annotationType, definitionContainer, commander) {
    this._annotationType = annotationType
    this._definitionContainer = definitionContainer
    this._commander = commander
  }

  changeTypeOfSelectedElement(newType) {
    return this._commander.factory.changeTypeOfSelectedItemsCommand(
      this._annotationType,
      newType
    )
  }

  addTypeDefinition(newType) {
    console.assert(newType.id, 'id is necessary!')
    return this._commander.factory.createTypeDefinitionCommand(
      this._definitionContainer,
      newType
    )
  }

  changeTypeDefinition(id, changedProperties) {
    return this._commander.factory.changeTypeDefinitionCommand(
      this._definitionContainer,
      this._annotationType,
      id,
      changedProperties
    )
  }

  removeType(id, label) {
    const removeType = {
      id,
      label: label || ''
    }

    if (typeof id === 'undefined') {
      throw new Error('You must set the type id to remove.')
    }

    return this._commander.factory.removeTypeDefinitionCommand(
      this._definitionContainer,
      removeType
    )
  }

  _labelChanged({ typeName, label, attributes = [] }) {
    const commands = this._commander.factory.changeItemTypeCommand(
      label,
      typeName,
      this._definitionContainer,
      attributes
    )

    if (typeName) {
      this._commander.invoke(commands)
    }
  }
}
