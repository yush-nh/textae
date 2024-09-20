import alertifyjs from 'alertifyjs'

export default class ConfigurationSaver {
  #eventEmitter

  constructor(eventEmitter) {
    this.#eventEmitter = eventEmitter
  }

  saveTo(url, editedData) {
    if (url) {
      this.#eventEmitter.emit('textae-event.resource.startSave')

      const opt = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedData),
        credentials: 'include'
      }

      fetch(url, opt)
        .then((response) => {
          if (response.ok) {
            this.#saved(editedData)
          } else {
            this.#firstFailed()
          }
        })
        .finally(() => this.#eventEmitter.emit('textae-event.resource.endSave'))
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

      const opt = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedData),
        credentials: 'include'
      }

      fetch(url, opt).then((response) => {
        if (response.ok) {
          this.#saved(editedData)
        } else {
          this.#failed()
        }
      })
    }
  }

  #failed() {
    alertifyjs.error('could not save')
    this.#eventEmitter.emit('textae-event.resource.save.error')
  }
}
