import { RESOURCE_TYPE } from './RESOURCE_TYPE'

export default class DataSource {
  #type
  #id
  #data

  static createURLSource(id, data) {
    console.assert(
      typeof id === 'string',
      'id must be a string when type is url.'
    )

    return new DataSource(RESOURCE_TYPE.REMOTE_URL, id, data)
  }

  static createFileSource(id, data) {
    console.assert(
      typeof id === 'string',
      'id must be a string when type is local file.'
    )

    return new DataSource(RESOURCE_TYPE.LOCAL_FILE, id, data)
  }

  static createInstantSource(data) {
    return new DataSource(RESOURCE_TYPE.INSTANT, null, data)
  }

  static createInlineSource(data) {
    return new DataSource(RESOURCE_TYPE.INLINE, null, data)
  }

  static createParameterSource(data) {
    return new DataSource(RESOURCE_TYPE.QUERY_PARAMETER, null, data)
  }

  /**
   * @constructor
   * @param {string} type - Indicates the type of data source: url, inline, instant, or local file.
   * @param {string | null} id - The url or file name of the data source.
   * @param {object | null} data - The data from data source. This parameter becomes null when data cannot be load.
   */
  constructor(type, id, data) {
    console.assert(
      RESOURCE_TYPE[type] !== undefined,
      'type must be url, inline, instant, local file.'
    )
    if (
      type === RESOURCE_TYPE.REMOTE_URL ||
      type === RESOURCE_TYPE.LOCAL_FILE
    ) {
      console.assert(
        typeof id === 'string',
        'id must be a string when type is url or local file.'
      )
    } else {
      console.assert(id === null, 'id must be null when type is not url.')
    }

    this.#type = type
    this.#id = id
    this.#data = data
  }

  get resourceType() {
    return this.#type
  }

  get id() {
    return this.#id
  }

  get data() {
    return this.#data
  }

  get displayName() {
    switch (this.#type) {
      case RESOURCE_TYPE.REMOTE_URL:
        return new URL(this.#id, location.href).href
      case RESOURCE_TYPE.LOCAL_FILE:
        return `${this.#id}(local file)`
      default:
        return `${this.#type}`
    }
  }
}
