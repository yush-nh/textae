import alertifyjs from 'alertifyjs'

// This is a map of function names specified in config and those used internally.
export default class Translator {
  #map

  constructor() {
    this.#map = new Map([
      ['logo', 'show logo'],
      ['read', 'import'],
      ['write', 'upload'],
      ['write-auto', 'upload automatically'],
      ['view', 'view mode'],
      ['term', 'edit term mode'],
      ['block', 'edit block mode'],
      ['relation', 'edit relation mode'],
      ['text-edit', 'edit text mode'],
      ['simple', 'simple view'],
      ['line-height', 'adjust lineheight'],
      ['line-height-auto', 'auto adjust lineheight'],
      ['undo', 'undo'],
      ['redo', 'redo'],
      ['replicate', 'replicate span annotation'],
      ['replicate-auto', 'auto replicate'],
      ['boundary-detection', 'boundary detection'],
      ['create-span-by-touch', 'create span by touch'],
      ['expand-span-by-touch', 'expand span by touch'],
      ['shrink-span-by-touch', 'shrink span by touch'],
      ['entity', 'new entity'],
      ['pallet', 'pallet'],
      ['edit-properties', 'edit properties'],
      ['delete', 'delete'],
      ['copy', 'copy'],
      ['cut', 'cut'],
      ['paste', 'paste'],
      ['setting', 'setting'],
      ['help', 'help']
    ])
  }

  get innerNames() {
    return this.#map.values()
  }

  translateToInnerNameFrom(functionName) {
    if (this.#map.has(functionName)) {
      return this.#map.get(functionName)
    }

    alertifyjs.warning(
      `'${functionName}' is an unknown function name for function availabilities.`
    )

    return functionName
  }
}
