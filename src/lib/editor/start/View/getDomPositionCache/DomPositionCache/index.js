import SpanAndEntityPosition from './SpanAndEntityPosition'
import LesserMap from './LesserMap'
import getSpan from './SpanAndEntityPosition/getSpan'
import getEntity from './SpanAndEntityPosition/getEntity'

export default class {
  constructor(editor, entityModel) {
    this._editor = editor
    this._entityModel = entityModel

    // The chache for position of grids.
    // This is updated at arrange position of grids.
    // This is referenced at create or move relations.
    this._gridPosition = new LesserMap()

    // The cache for span positions.
    // Getting the postion of spans is too slow about 5-10 ms per a element in Chrome browser. For example offsetTop property.
    // This cache is big effective for the initiation, and little effective for resize.
    this._spanCache = new LesserMap()

    this._entityCache = new LesserMap()

    this._spanAndEntityPosition = new SpanAndEntityPosition(
      editor,
      entityModel,
      this._gridPosition
    )
    this._relation = new LesserMap()
  }

  get gridPositionCache() {
    return this._gridPosition
  }

  reset() {
    this._spanCache.clear()
    this._entityCache.clear()
  }

  getSpan(spanId) {
    if (!this._spanCache.has(spanId)) {
      this._spanCache.set(spanId, getSpan(this._editor, spanId))
    }

    return this._spanCache.get(spanId)
  }

  getGrid(id) {
    return this._gridPosition.get(id)
  }

  getEntity(entityId) {
    if (!this._entityCache.has(entityId)) {
      this._entityCache.set(
        entityId,
        getEntity(this._editor, this._entityModel, this._gridPosition, entityId)
      )
    }

    return this._entityCache.get(entityId)
  }

  cacheAllSpan(spans) {
    for (const span of spans) {
      this._spanAndEntityPosition.getSpan(span.id)
    }
  }

  setGrid(id, val) {
    this._gridPosition.set(id, val)
  }

  get connectCache() {
    return this._relation
  }

  toConnect(relationId) {
    return this._relation.get(relationId)
  }

  isGridPrepared(entityId) {
    const spanId = this._entityModel.get(entityId).span
    return this._gridPosition.get(spanId)
  }
}
