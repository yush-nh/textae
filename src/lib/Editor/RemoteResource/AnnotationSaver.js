import $ from 'jquery'
import alertifyjs from 'alertifyjs'
import isServerAuthRequired from './isServerAuthRequired'
import openPopUp from './openPopUp'

export default class AnnotationSaver {
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
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editedData),
          credentials: 'include'
        }

        // Retry after authentication.
        fetch(url, opt)
          .then((response) => {
            if (response.ok) {
              response.json().then((annotation) => this.#saved(url, annotation))
            } else {
              this.#finalFailed(url)
            }
          })
          .finally(() =>
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
