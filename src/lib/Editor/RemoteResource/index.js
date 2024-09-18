import $ from 'jquery'
import alertifyjs from 'alertifyjs'
import isServerAuthRequired from './isServerAuthRequired'
import openPopUp from './openPopUp'
import AnnotationLoader from './AnnotationLoader'
import ConfigurationLoader from './ConfigurationLoader'

// A sub component to save and load data.
export default class RemoteSource {
  #eventEmitter

  constructor(eventEmitter) {
    this.#eventEmitter = eventEmitter
  }

  loadAnnotation(url) {
    new AnnotationLoader(this.#eventEmitter).loadFrom(url)
  }

  loadConfiguration(url, annotationModelSource = null) {
    new ConfigurationLoader(this.#eventEmitter).loadFrom(
      url,
      annotationModelSource
    )
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
