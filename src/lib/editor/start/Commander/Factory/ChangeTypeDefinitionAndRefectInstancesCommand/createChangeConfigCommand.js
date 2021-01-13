import ChangeTypeDefinitionCommand from '../ChangeTypeDefinitionCommand'
import CreateTypeDefinitionCommand from '../CreateTypeDefinitionCommand'

export default function (
  typeContainer,
  id,
  editor,
  annotationData,
  changedProperties
) {
  // The palette also displays instance types other than type in the typeDefinition,
  // so modified type may not be in the typeDefinition.
  if (typeContainer.has(id)) {
    return new ChangeTypeDefinitionCommand(
      editor,
      annotationData,
      typeContainer,
      id,
      changedProperties,
      null
    )
  } else {
    // The change properties contain only the changed attributes.
    // When the ID is changed, it does not overwrite the ID with the old ID.
    // When you add a label, the old ID is used to add the type definition.
    return new CreateTypeDefinitionCommand(
      editor,
      typeContainer,
      Object.assign(
        {
          id
        },
        Object.fromEntries(changedProperties)
      )
    )
  }
}
