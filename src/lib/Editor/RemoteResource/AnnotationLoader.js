import alertifyjs from 'alertifyjs'
import DataSource from '../DataSource'

export default class AnnotationLoader {
  #eventEmitter

  constructor(eventEmitter) {
    this.#eventEmitter = eventEmitter
  }

  loadFrom(url) {
    console.assert(url, 'url is necessary!')

    this.#eventEmitter.emit('textae-event.resource.startLoad')

    fetch(url, {
      method: 'GET',
      cache: 'no-cache',
      credentials: 'omit',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(30000)
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((annotation) => this.#loaded(url, annotation))
        } else if (response.status === 401) {
          this.#authenticate(url)
        } else {
          this.#failed(url)
        }
      })
      .finally(() => this.#eventEmitter.emit('textae-event.resource.endLoad'))
  }

  #loaded(url, annotation) {
    const dataSource = DataSource.createURLSource(url, annotation)
    if (annotation && annotation.text) {
      this.#eventEmitter.emit(
        'textae-event.resource.annotation.load.success',
        dataSource
      )
      this.#eventEmitter.emit(
        'textae-event.resource.annotation.url.set',
        dataSource
      )
    } else {
      this.#eventEmitter.emit(
        'textae-event.resource.annotation.format.error',
        dataSource
      )
    }
  }

  #authenticate(url) {
    // When authentication is requested, give credential and try again.
    fetch(url, {
      method: 'GET',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      signal: AbortSignal.timeout(30000)
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((annotation) => this.#loaded(url, annotation))
        } else {
          this.#failed(url)
        }
      })
      .catch(() => this.#failed(url))
      .finally(() => this.#eventEmitter.emit('textae-event.resource.endLoad'))
  }

  #failed(url) {
    alertifyjs.error(
      `Could not load the file from the location you specified.: ${url}`
    )
    this.#eventEmitter.emit('textae-event.resource.annotation.load.error', url)
  }
}
