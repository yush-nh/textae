import $ from 'jquery'
import alertifyjs from 'alertifyjs'
import DataSource from '../DataSource'
import isServerAuthRequired from './isServerAuthRequired'
import openPopUp from './openPopUp'

// A sub component to save and load data.
export default class RemoteSource {
  #eventEmitter
  #urlOfLastRead

  constructor(eventEmitter) {
    this.#eventEmitter = eventEmitter

    // Store the url the annotation data is loaded from per editor.
    this.#urlOfLastRead = {
      annotation: '',
      config: ''
    }
  }

  get annotationUrl() {
    return this.#urlOfLastRead.annotation
  }

  set annotationUrl(dataSource) {
    if (dataSource.type === 'url') {
      this.#urlOfLastRead.annotation = dataSource.id
    }
  }

  get configurationUrl() {
    return this.#urlOfLastRead.config
  }

  // The configuration validation is done with setConfigAndAnnotation
  // because it requires both configuration and annotation.
  // The URL is set after the validation.
  set configurationUrl(dataSource) {
    if (dataSource.type === 'url') {
      this.#urlOfLastRead.config = dataSource.id
    }
  }

  loadAnnotation(url) {
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
      .done((annotation) => this.#annotationLoaded(url, annotation))
      .fail((jqXHR) => this.#annotationLoadFirstFailed(jqXHR, url))
      .always(() => this.#eventEmitter.emit('textae-event.resource.endLoad'))
  }

  // The second argument is the annotation you want to be notified of
  // when the configuration loading is complete.
  // This is supposed to be used when reading an annotation that does not contain a configuration
  // and then reading the configuration set by the attribute value of the textae-event.
  loadConfiguration(url, annotationModelSource = null) {
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
      .done((config) => this.#configLoaded(url, config, annotationModelSource))
      .fail(() => this.#configLoadFailed(url))
      .always(() => this.#eventEmitter.emit('textae-event.resource.endLoad'))
  }

  saveAnnotation(url, editedData) {
    if (url) {
      this.#eventEmitter.emit('textae-event.resource.startSave')

      const opt = {
        type: 'post',
        url,
        contentType: 'application/json',
        data: JSON.stringify(editedData),
        crossDomain: true,
        xhrFields: {
          withCredentials: true
        }
      }

      $.ajax(opt)
        .done(() => this.#annotationSaved(editedData))
        .fail((jqXHR) =>
          this.#annotationSaveFirstFailed(jqXHR, url, editedData)
        )
        .always(() => this.#eventEmitter.emit('textae-event.resource.endSave'))
    }
  }

  saveConfiguration(url, editedData) {
    // textae-config service is build with the Ruby on Rails 4.X.
    // To change existing files, only PATCH method is allowed on the Ruby on Rails 4.X.
    if (url) {
      const data = JSON.stringify(editedData)

      this.#eventEmitter.emit('textae-event.resource.startSave')

      $.ajax({
        type: 'patch',
        url,
        contentType: 'application/json',
        data,
        crossDomain: true,
        xhrFields: {
          withCredentials: true
        }
      })
        .done(() => this.#configSaved(editedData))
        .fail(() => this.#configSaveFirstFailed(url, editedData))
        .always(() => this.#eventEmitter.emit('textae-event.resource.endSave'))
    }
  }

  #annotationLoaded(url, annotation) {
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

  #annotationLoadFirstFailed(jqXHR, url) {
    if (jqXHR.status !== 401) {
      return this.#annotationLoadFinalFailed(url)
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
      .done((annotation) => this.#annotationLoaded(url, annotation))
      .fail(() => this.#annotationLoadFinalFailed(url))
      .always(() => this.#eventEmitter.emit('textae-event.resource.endLoad'))
  }

  #annotationLoadFinalFailed(url) {
    alertifyjs.error(
      `Could not load the file from the location you specified.: ${url}`
    )
    this.#eventEmitter.emit('textae-event.resource.annotation.load.error', url)
  }

  #configLoaded(url, config, annotationModelSource) {
    this.#eventEmitter.emit(
      'textae-event.resource.configuration.load.success',
      DataSource.createURLSource(url, config),
      annotationModelSource
    )
  }

  #configLoadFailed(url) {
    alertifyjs.error(
      `Could not load the file from the location you specified.: ${url}`
    )
    this.#eventEmitter.emit(
      'textae-event.resource.configuration.load.error',
      url
    )
  }

  #annotationSaved(editedData) {
    alertifyjs.success('annotation saved')
    this.#eventEmitter.emit('textae-event.resource.annotation.save', editedData)
  }

  #annotationSaveFirstFailed(jqXHR, url, editedData) {
    // Authenticate in popup window.
    const location = isServerAuthRequired(
      jqXHR.status,
      jqXHR.getResponseHeader('WWW-Authenticate'),
      jqXHR.getResponseHeader('Location')
    )
    if (!location) {
      return this.#annotationSaveFinalFailed()
    }

    const window = openPopUp(location)
    if (!window) {
      return this.#annotationSaveFinalFailed()
    }

    // Watching for cross-domain pop-up windows to close.
    // https://stackoverflow.com/questions/9388380/capture-the-close-event-of-popup-window-in-javascript/48240128#48240128
    const timer = setInterval(() => {
      if (window.closed) {
        clearInterval(timer)

        const opt = {
          type: 'post',
          url,
          contentType: 'application/json',
          data: JSON.stringify(editedData),
          crossDomain: true,
          xhrFields: {
            withCredentials: true
          }
        }

        // Retry after authentication.
        $.ajax(opt)
          .done(() => this.#annotationSaved(editedData))
          .fail(() => this.#annotationSaveFinalFailed)
          .always(() =>
            this.#eventEmitter.emit('textae-event.resource.endSave')
          )
      }
    }, 1000)
  }

  #annotationSaveFinalFailed() {
    alertifyjs.error('could not save')
    this.#eventEmitter.emit('textae-event.resource.save.error')
  }

  #configSaved(editedData) {
    alertifyjs.success('configuration saved')
    this.#eventEmitter.emit(
      'textae-event.resource.configuration.save',
      editedData
    )
  }

  #configSaveFirstFailed(url, editedData) {
    {
      // Retry by a post method.
      this.#eventEmitter.emit('textae-event.resource.startSave')

      $.ajax({
        type: 'post',
        url,
        contentType: 'application/json',
        data: JSON.stringify(editedData),
        crossDomain: true,
        xhrFields: {
          withCredentials: true
        }
      })
        .done(() => this.#configSaved(editedData))
        .fail(() => this.#configSaveFinalFailed())
        .always(() => this.#eventEmitter.emit('textae-event.resource.endSave'))
    }
  }

  #configSaveFinalFailed() {
    alertifyjs.error('could not save')
    this.#eventEmitter.emit('textae-event.resource.save.error')
  }
}
