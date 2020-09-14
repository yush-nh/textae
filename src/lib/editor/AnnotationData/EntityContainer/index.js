import ContainerWithSubContainer from '../ContainerWithSubContainer'
import EntityModel from '../../EntityModel'
import mappingFunction from './mappingFunction'
import issueId from '../issueId'

export default class extends ContainerWithSubContainer {
  constructor(editor, emitter, parentContainer) {
    super(emitter, parentContainer, 'entity', (denotations) => {
      const collection = mappingFunction(
        editor,
        super.attributeContainer,
        super.relationContainer,
        this.definedTypes,
        denotations
      )

      // Move medols without id behind others, to prevet id duplication generated and exists.
      collection.sort((a, b) => {
        if (!a.id) return 1
        if (!b.id) return -1
        if (a.id < b.id) return -1
        if (a.id > b.id) return 1

        return 0
      })

      return collection
    })

    this._editor = editor
  }

  add(entity) {
    if (!entity.span)
      throw new Error(`entity has no span! ${JSON.stringify(entity)}`)

    // When redoing, the entity is instance of the EntityModel already.
    if (entity instanceof EntityModel) {
      return super.add(entity)
    }

    return super.add(
      new EntityModel(
        this._editor,
        super.attributeContainer,
        super.relationContainer,
        this.definedTypes,
        entity.span,
        entity.typeName
      )
    )
  }

  moveEntities(spanId, entities) {
    for (const entity of entities) {
      entity.span = spanId
    }
    this._emit(`textae.annotationData.entity.move`, entities)
  }

  getAllOfSpan(spanId) {
    return this.all.filter((entity) => spanId === entity.span)
  }

  _addToContainer(instance) {
    return super._addToContainer(issueId(instance, this._container, 'T'))
  }
}
