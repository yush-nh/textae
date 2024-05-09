import toSourceString from './toSourceString'

export default class DataSource {
  #type
  #id
  #data

  static createURLSource(id, data) {
    console.assert(
      typeof id === 'string',
      'id must be a string when type is url.'
    )

    return new DataSource('url', id, data)
  }

  static createFileSource(id, data) {
    console.assert(
      typeof id === 'string',
      'id must be a string when type is local file.'
    )

    return new DataSource('local file', id, data)
  }

  static createInstantSource(data) {
    return new DataSource('instant', null, data)
  }

  static createInlineSource(data) {
    return new DataSource('inline', null, data)
  }

  /**
   * @constructor
   * @param {string} type - Indicates the type of data source: url, inline, instant, or local file.
   * @param {string | null} id - The url or file name of the data source.
   * @param {object | null} data - The data from data source. This parameter becomes null when data cannot be load.
   */
  constructor(type, id, data) {
    console.assert(
      type === 'url' ||
        type === 'inline' ||
        type === 'instant' ||
        type === 'local file' ||
        type === null,
      'type must be url, inline, instant, local file or null.'
    )
    if (type === 'url' || type === 'local file') {
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

  get type() {
    return this.#type
  }

  get id() {
    return this.#id
  }

  get data() {
    return this.#data
  }

  get displayName() {
    return toSourceString(this.#type, this.#id)
  }
}
