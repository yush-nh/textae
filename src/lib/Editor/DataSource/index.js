import toSourceString from './toSourceString'

export default class DataSource {
  #type
  #id
  #data

  constructor(type, id, data) {
    console.assert(
      type === 'url' ||
        type === 'inline' ||
        type === 'instant' ||
        type === 'local file' ||
        type === null,
      'type must be url, inline, instant, local file or null.'
    )
    if (type === 'url') {
      console.assert(
        typeof id === 'string',
        'id must be a string when type is url.'
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
