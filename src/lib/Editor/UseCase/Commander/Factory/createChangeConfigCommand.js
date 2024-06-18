import ChangeTypeDefinitionCommand from './ChangeTypeDefinitionCommand'
import CreateTypeDefinitionCommand from './CreateTypeDefinitionCommand'

export default function (
  definitionContainer,
  id,
  annotationModel,
  changedProperties
) {
  // The palette also displays instance types other than type in the typeDictionary,
  // so modified type may not be in the typeDictionary.
  if (definitionContainer.has(id)) {
    return new ChangeTypeDefinitionCommand(
      annotationModel,
      definitionContainer,
      id,
      changedProperties,
      null
    )
  } else {
    // The change properties contain only the changed attributes.
    // When the ID is changed, it does not overwrite the ID with the old ID.
    // When you add a label, the old ID is used to add the type definition.
    return new CreateTypeDefinitionCommand(definitionContainer, {
      id,
      ...Object.fromEntries(changedProperties)
    })
  }
}
