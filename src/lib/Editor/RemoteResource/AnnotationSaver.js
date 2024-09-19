import $ from 'jquery'
import alertifyjs from 'alertifyjs'
import isServerAuthRequired from './isServerAuthRequired'
import openPopUp from './openPopUp'

class AnnotationSaver {
  #eventEmitter

  constructor(eventEmitter) {
    this.#eventEmitter = eventEmitter
  }

  saveTo(url, editedData) {
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
        .done(() => this.#saved(editedData))
        .fail((jqXHR) => this.#firstFailed(jqXHR, url, editedData))
        .always(() => this.#eventEmitter.emit('textae-event.resource.endSave'))
    }
  }

  #saved(editedData) {
    alertifyjs.success('annotation saved')
    this.#eventEmitter.emit('textae-event.resource.annotation.save', editedData)
  }

  #firstFailed(jqXHR, url, editedData) {
    // Authenticate in popup window.
    const location = isServerAuthRequired(
      jqXHR.status,
      jqXHR.getResponseHeader('WWW-Authenticate'),
      jqXHR.getResponseHeader('Location')
    )
    if (!location) {
      return this.#finalFailed()
    }

    const window = openPopUp(location)
    if (!window) {
      return this.#finalFailed()
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
          .done(() => this.#saved(editedData))
          .fail(() => this.#finalFailed)
          .always(() =>
            this.#eventEmitter.emit('textae-event.resource.endSave')
          )
      }
    }, 1000)
  }

  #finalFailed() {
    alertifyjs.error('could not save')
    this.#eventEmitter.emit('textae-event.resource.save.error')
  }
}
