import getSpan from './getSpan'

export default class {
  constructor(editor) {
    this._editor = editor

    // The cache for span positions.
    // Getting the postion of spans is too slow about 5-10 ms per a element in Chrome browser. For example offsetTop property.
    // This cache is big effective for the initiation, and little effective for resize.
    this._spanCache = new Map()

    // The chache for position of grids.
    // This is updated at arrange position of grids.
    // This is referenced at create or move relations.
    this._gridCache = new Map()

    this._connectCache = new Map()
  }

  cacheAllSpan(spans) {
    for (const span of spans) {
      this.getSpan(span.id)
    }
  }

  getSpan(spanId) {
    if (!this._spanCache.has(spanId)) {
      this._spanCache.set(spanId, getSpan(this._editor, spanId))
    }

    return this._spanCache.get(spanId)
  }

  removeAllSpan() {
    this._spanCache.clear()
  }

  setGrid(id, val) {
    this._gridCache.set(id, val)
  }

  getGrid(id) {
    return this._gridCache.get(id)
  }

  removeGrid(id) {
    this._gridCache.delete(id)
  }

  removeAllGrid() {
    this._gridCache.clear()
  }

  setConnect(id, val) {
    this._connectCache.set(id, val)
  }

  getConnect(relationId) {
    return this._connectCache.get(relationId)
  }

  removeConnect(id) {
    this._connectCache.delete(id)
  }

  removeAllConnect() {
    this._connectCache.clear()
  }
}
