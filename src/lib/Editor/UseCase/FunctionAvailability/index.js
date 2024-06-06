import Translator from './Translator'

export default class FunctionAvailability {
  #translator
  #availabilities

  constructor() {
    this.#translator = new Translator()

    // This is a map whose key is the function name
    // and its value is boolean value that is true if enabled.
    this.#availabilities = this.#defaultAvailabilities
  }

  isAvailable(innerName) {
    return this.#availabilities.get(innerName)
  }

  set availability(values) {
    const availabilities = this.#defaultAvailabilities

    if (values) {
      for (const [functionName, value] of Object.entries(values)) {
        availabilities.set(
          this.#translator.translateToInnerNameFrom(functionName),
          value
        )
      }
    }

    this.#availabilities = availabilities
  }

  get #defaultAvailabilities() {
    const map = new Map()

    // All functions are enabled by default.
    for (const innerName of this.#translator.innerNames) {
      // Text edit mode is disabled by default because it is under development.
      if (innerName === 'edit text mode') {
        map.set(innerName, false)
      } else {
        map.set(innerName, true)
      }
    }

    return map
  }
}
