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
      ['block', { name: 'edit block mode', enabled: true }],
      ['relation', { name: 'edit relation mode', enabled: true }],
      ['text-edit', { name: 'edit text mode', enabled: true }],
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

  get innerNames() {
    return this.#map.values().map((value) => value.name)
  }

  translateToInnerNameFrom(functionName) {
    if (this.#map.has(functionName)) {
      return this.#map.get(functionName).name
    }

    alertifyjs.warning(
      `'${functionName}' is an unknown function name for function availabilities.`
    )

    return functionName
  }
}
