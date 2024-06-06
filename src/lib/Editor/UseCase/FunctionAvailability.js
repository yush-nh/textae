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
    this.#availabilities = this.#default
  }

  isAvailable(type) {
    return this.#availabilities.get(type)
  }

  set availability(values) {
    const availabilities = this.#default

    if (values) {
      for (const [key, value] of Object.entries(values)) {
        availabilities.set(this.#translate(key), value)
      }
    }

    this.#availabilities = availabilities
  }

  get #default() {
    const map = new Map()

    // All functions are enabled by default.
    for (const key of NAME_MAP.values()) {
      // Text edit mode is disabled by default because it is under development.
      if (key === 'edit text mode') {
        map.set(key, false)
      } else {
        map.set(key, true)
      }
    }

    return map
  }

  #translate(keyName) {
    if (NAME_MAP.has(keyName)) {
      return NAME_MAP.get(keyName)
    }

    alertifyjs.warning(
      `'${keyName}' is an unknown function name for function availabilities.`
    )

    return keyName
  }
}
