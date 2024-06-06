import alertifyjs from 'alertifyjs'

// This is a map of function names specified in config and those used internally.
export default class Translator {
  #map

  constructor() {
    this.#map = new Map([
      ['logo', { name: 'show logo', enabled: true }],
      ['read', { name: 'import', enabled: true }],
      ['write', { name: 'upload', enabled: true }],
      ['write-auto', { name: 'upload automatically', enabled: true }],
      ['view', { name: 'view mode', enabled: true }],
      ['term', { name: 'edit term mode', enabled: true }],
      ['term-edit', { alias: 'term' }],
      ['block', { name: 'edit block mode', enabled: true }],
      ['block-edit', { alias: 'block' }],
      ['relation', { name: 'edit relation mode', enabled: true }],
      ['relation-edit', { alias: 'relation' }],
      // Text edit mode is disabled by default because it is under development.
      ['text-edit', { name: 'edit text mode', enabled: false }],
      ['simple', { name: 'simple view', enabled: true }],
      ['line-height', { name: 'adjust lineheight', enabled: true }],
      ['line-height-auto', { name: 'auto adjust lineheight', enabled: true }],
      ['undo', { name: 'undo', enabled: true }],
      ['redo', { name: 'redo', enabled: true }],
      ['replicate', { name: 'replicate span annotation', enabled: true }],
      ['replicate-auto', { name: 'auto replicate', enabled: true }],
      ['boundary-detection', { name: 'boundary detection', enabled: true }],
      ['create-span-by-touch', { name: 'create span by touch', enabled: true }],
      ['expand-span-by-touch', { name: 'expand span by touch', enabled: true }],
      ['shrink-span-by-touch', { name: 'shrink span by touch', enabled: true }],
      ['entity', { name: 'new entity', enabled: true }],
      ['pallet', { name: 'pallet', enabled: true }],
      ['edit-properties', { name: 'edit properties', enabled: true }],
      ['delete', { name: 'delete', enabled: true }],
      ['copy', { name: 'copy', enabled: true }],
      ['cut', { name: 'cut', enabled: true }],
      ['paste', { name: 'paste', enabled: true }],
      ['setting', { name: 'setting', enabled: true }],
      ['help', { name: 'help', enabled: true }]
    ])
  }

  get defaultAvailabilities() {
    const map = new Map()

    for (const { name, enabled } of this.#map
      .values()
      .filter(
        ({ name, enabled }) => name !== undefined && enabled !== undefined
      )) {
      map.set(name, enabled)
    }

    return map
  }

  translateToInnerNameFrom(functionName) {
    if (this.#map.has(functionName)) {
      const value = this.#map.get(functionName)
      if (value.alias) {
        return this.#map.get(value.alias).name
      } else {
        return value.name
      }
    }

    alertifyjs.warning(
      `'${functionName}' is an unknown function name for function availabilities.`
    )

    return functionName
  }
}
