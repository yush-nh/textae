import CompositeCommand from '../CompositeCommand'
import createChangeConfigCommand from '../createChangeConfigCommand'
import createChangeAnnotationCommands from './createChangeAnnotationCommands'

export default class ChangeTypeDefinitionAndReflectInstancesCommand extends CompositeCommand {
  constructor(
    annotationModel,
    definitionContainer,
    annotationType,
    id,
    changedProperties
  ) {
    super()

    // change config
    const changeConfigCommands = [
      createChangeConfigCommand(
        definitionContainer,
        id,
        annotationModel,
        changedProperties
      )
    ]

    let changAnnotationCommands = []
    // change annotation
    if (changedProperties.has('id')) {
      changAnnotationCommands = createChangeAnnotationCommands(
        annotationModel,
        annotationType,
        id,
        changedProperties.get('id')
      )
    }

    this._subCommands = changeConfigCommands.concat(changAnnotationCommands)
    this._logMessage = `set ${[...changedProperties.entries()].map(
      ([id, val]) => `${id}:${val}`
    )} to type definition ${id}`
  }
}
