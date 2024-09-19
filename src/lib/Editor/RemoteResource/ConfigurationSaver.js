import $ from 'jquery'
import alertifyjs from 'alertifyjs'

export default class ConfigurationSaver {
  #eventEmitter

  constructor(eventEmitter) {
    this.#eventEmitter = eventEmitter
  }

  saveTo(url, editedData) {
    if (url) {
      this.#eventEmitter.emit('textae-event.resource.startSave')

      $.ajax({
        type: 'patch',
        url,
        contentType: 'application/json',
        data: JSON.stringify(editedData),
        crossDomain: true,
        xhrFields: {
          withCredentials: true
        }
      })
        .done(() => this.#saved(editedData))
        .fail(() => this.#firstFailed(url, editedData))
        .always(() => this.#eventEmitter.emit('textae-event.resource.endSave'))
    }
  }

  #saved(editedData) {
    alertifyjs.success('configuration saved')
    this.#eventEmitter.emit(
      'textae-event.resource.configuration.save',
      editedData
    )
  }

  #firstFailed(url, editedData) {
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
        .done(() => this.#saved(editedData))
        .fail(() => this.#finalFailed())
        .always(() => this.#eventEmitter.emit('textae-event.resource.endSave'))
    }
  }

  #finalFailed() {
    alertifyjs.error('could not save')
    this.#eventEmitter.emit('textae-event.resource.save.error')
  }
}
