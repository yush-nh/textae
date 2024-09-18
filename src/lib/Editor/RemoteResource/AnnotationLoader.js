import $ from 'jquery'
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

    $.ajax({
      type: 'GET',
      url,
      cache: false,
      xhrFields: {
        withCredentials: false
      },
      timeout: 30000,
      dataType: 'json'
    })
      .done((annotation) => this.#loaded(url, annotation))
      .fail((jqXHR) => this.#loadFirstFailed(jqXHR, url))
      .always(() => this.#eventEmitter.emit('textae-event.resource.endLoad'))
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

  #loadFirstFailed(jqXHR, url) {
    if (jqXHR.status !== 401) {
      return this.#loadFinalFailed(url)
    }

    // When authentication is requested, give credential and try again.
    $.ajax({
      type: 'GET',
      url,
      cache: false,
      xhrFields: {
        withCredentials: true
      },
      timeout: 30000,
      dataType: 'json'
    })
      .done((annotation) => this.#loaded(url, annotation))
      .fail(() => this.#loadFinalFailed(url))
      .always(() => this.#eventEmitter.emit('textae-event.resource.endLoad'))
  }

  #loadFinalFailed(url) {
    alertifyjs.error(
      `Could not load the file from the location you specified.: ${url}`
    )
    this.#eventEmitter.emit('textae-event.resource.annotation.load.error', url)
  }
}
