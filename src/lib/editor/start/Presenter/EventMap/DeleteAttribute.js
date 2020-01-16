export default class {
  constructor(commander, annotationData) {
    this._commander = commander
    this._annotationData = annotationData
  }

  handle(typeDefinition, number) {
    const attrDef = typeDefinition.entity.getAttributeAt(number)

    const command = this._commander.factory.attributeRemoveByPredCommand(
      attrDef
    )
    this._commander.invoke(command)
  }
}
