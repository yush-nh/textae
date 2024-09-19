import $ from 'jquery'
import alertifyjs from 'alertifyjs'
import AnnotationLoader from './AnnotationLoader'
import ConfigurationLoader from './ConfigurationLoader'
import AnnotationSaver from './AnnotationSaver'

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
    new AnnotationSaver(this.#eventEmitter).saveTo(url, editedData)
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
