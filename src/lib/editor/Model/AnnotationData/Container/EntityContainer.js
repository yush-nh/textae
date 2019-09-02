import idFactory from '../../../idFactory'
import ContatinerWithEmitter from './ContatinerWithEmitter'

export default class extends ContatinerWithEmitter {
  constructor(editor, emitter, relation) {
    super(
      emitter,
      'entity',
      (denotations) => mappingFunction(editor, emitter, denotations),
      'T'
    )

    this._relation = relation
  }

  add(entity) {
    if (!entity.span)
      throw new Error(`entity has no span! ${JSON.stringify(entity)}`)

    if (!entity.attributes) {
      // When undoing, the entity already has id and attributes getters.
      const emitter = super.emitter
      return super.add(entity, () => {
        Object.defineProperty(entity, 'attributes', {
          get: () => getAttributesOf(emitter, entity.id)
        })
      })
    }

    return super.add(entity)
  }

  assosicatedRelations(entityId) {
    return this._relation.all
      .filter((r) => r.obj === entityId || r.subj === entityId)
      .map((r) => r.id)
  }
}

function getAttributesOf(emitter, entityId) {
  return emitter.attribute.all.filter((a) => a.subj === entityId)
}

// Expected an entity like {id: "E21", span: "editor2__S50_54", type: "Protein"}.
function toModel(editor, emitter, entity) {
  return {
    id: entity.id,
    span: idFactory.makeSpanId(editor, entity.span),
    type: entity.obj,
    get attributes() {
      return getAttributesOf(emitter, this.id)
    }
  }
}

function mappingFunction(editor, emitter, denotations) {
  denotations = denotations || []
  return denotations.map((entity) => toModel(editor, emitter, entity))
}
