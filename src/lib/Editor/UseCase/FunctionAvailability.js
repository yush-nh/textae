import alertifyjs from 'alertifyjs'

// This is a map of function names specified in config and those used internally.
const NAME_MAP = new Map([
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

export default class FunctionAvailability {
  #availabilities

  constructor() {
    // This is a map whose key is the function name
    // and its value is boolean value that is true if enabled.
    this.#availabilities = this.#defaultAvailabilities
  }

  isAvailable(type) {
    return this.#availabilities.get(type)
  }

  set availability(values) {
    const availabilities = this.#defaultAvailabilities

    if (values) {
      for (const [functionName, value] of Object.entries(values)) {
        availabilities.set(this.#translateToInnerNameFrom(functionName), value)
      }
    }

    this.#availabilities = availabilities
  }

  get #defaultAvailabilities() {
    const map = new Map()

    // All functions are enabled by default.
    for (const innerName of NAME_MAP.values()) {
      // Text edit mode is disabled by default because it is under development.
      if (innerName === 'edit text mode') {
        map.set(innerName, false)
      } else {
        map.set(innerName, true)
      }
    }

    return map
  }

  #translateToInnerNameFrom(functionName) {
    if (NAME_MAP.has(functionName)) {
      return NAME_MAP.get(functionName)
    }

    alertifyjs.warning(
      `'${functionName}' is an unknown function name for function availabilities.`
    )

    return functionName
  }
}
