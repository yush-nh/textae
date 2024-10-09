import getUrlMatches from '../../getUrlMatches'
import formatForPallet from './formatForPallet'
import sortByCountAndName from './sortByCountAndName'
import countUsage from './countUsage'

export default class DefinitionContainer {
  #eventEmitter
  #annotationType
  /** @type {import('../DefinedTypeContainer').default} **/
  #definedTypes
  #getAllInstanceFunc
  #defaultColor
  #defaultType

  constructor(eventEmitter, annotationType, getAllInstanceFunc, defaultColor) {
    this.#eventEmitter = eventEmitter
    this.#annotationType = annotationType
    this.#definedTypes = null
    this.#getAllInstanceFunc = getAllInstanceFunc
    this.#defaultColor = defaultColor
  }

  get annotationType() {
    return this.#annotationType
  }

  /**
   * @returns {import('../DefinedTypeContainer').default}
   */
  get definedTypes() {
    return this.#definedTypes
  }

  /**
   * @param {import('../DefinedTypeContainer').default} value
   */
  set definedTypes(value) {
    this.#definedTypes = value

    // Set default type
    const defaultType = value.default
    if (defaultType) {
      delete defaultType.default
      this.#defaultType = defaultType.id
    } else {
      this.#defaultType = null
    }
  }

  has(id) {
    return this.#definedTypes.has(id)
  }

  get(id) {
    const type = { ...this.#definedTypes.get(id) }

    if (this.#defaultType === id) {
      type.default = true
      return type
    } else {
      delete type.default
      return type
    }
  }

  replace(id, newType) {
    this.#definedTypes.replace(id, newType)
    this.#eventEmitter.emit(
      `textae-event.type-definition.${this.#annotationType}.change`,
      newType.id
    )
  }

  addDefinedType(newType) {
    if (typeof newType.color === 'undefined') {
      const forwardMatchColor = this.getColor(newType.id)
      if (forwardMatchColor !== this.#defaultColor) {
        newType.color = forwardMatchColor
      }
    }

    if (typeof newType.label === 'undefined') {
      const forwardMatchLabel = this.getLabel(newType.id)
      if (forwardMatchLabel) {
        newType.label = forwardMatchLabel
      }
    }

    if (newType.default) {
      this.#defaultType = newType.id
    }

    this.replace(newType.id, newType)
  }

  // Return the type that has the default property or the most used type.
  get defaultType() {
    if (this.#defaultType) {
      return this.#defaultType
    }

    if (this.#getAllInstanceFunc().length > 0) {
      return sortByCountAndName(
        countUsage(this.#typeMap, this.#getAllInstanceFunc())
      )[0]
    }

    return 'something'
  }

  // The default value can be removed.
  set defaultType(id) {
    this.#defaultType = id
    this.#eventEmitter.emit(
      `textae-event.type-definition.${this.#annotationType}.change-default`,
      id
    )
  }

  get defaultColor() {
    return this.#defaultColor
  }

  getColor(id) {
    const config = this.#definedTypes.getConfig(id)
    return (config && config.color) || this.#defaultColor
  }

  getLabel(id) {
    const config = this.#definedTypes.getConfig(id)
    return config && config.label
  }

  getURI(id) {
    return getUrlMatches(id) ? id : undefined
  }

  findByLabel(term) {
    return this.definedTypes.labelsIncludes(term)
  }

  get pallet() {
    const countMap = countUsage(this.#typeMap, this.#getAllInstanceFunc())
    const types = sortByCountAndName(countMap)

    return formatForPallet(
      types,
      countMap,
      this.#definedTypes,
      this.defaultType,
      this.#defaultColor
    )
  }

  get config() {
    const types = this.#typeMap

    // Make default type and delete defalut type from original configuratian.
    for (const [key, type] of types.entries()) {
      // Make a copy so as not to destroy the original object.
      const copy = { ...type }
      if (type.id === this.defaultType) {
        copy.default = true
      } else {
        delete copy.default
      }
      types.set(key, copy)
    }

    return [...types.values()]
  }

  get #typeMap() {
    // Get type definitions.
    // Copy map to add definitions from instance.
    const types = this.#definedTypes.map

    // Get types from instances.
    for (const { typeName } of this.#getAllInstanceFunc()) {
      if (!types.has(typeName)) {
        types.set(typeName, { id: typeName })
      }
    }

    return types
  }

  delete(id, defaultType) {
    this.#definedTypes.delete(id)
    this.#defaultType = defaultType
    this.#eventEmitter.emit(
      `textae-event.type-definition.${this.#annotationType}.delete`,
      id
    )
  }
}
