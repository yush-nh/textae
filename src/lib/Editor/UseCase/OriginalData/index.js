import StatusBar from './StatusBar'
import patchConfiguration from '../patchConfiguration'

// Manage the original annotations and the original configuration and merge the changes when you save them.
export default class OriginalData {
  #eventEmitter
  #statusBar
  #annotation
  #configuration

  constructor(eventEmitter, editorHTMLElement, isShow) {
    this.#eventEmitter = eventEmitter
    this.#statusBar = new StatusBar(editorHTMLElement, isShow)

    eventEmitter
      .on('textae-event.resource.annotation.save', (editedData) => {
        this.#annotationOnly = editedData
      })
      .on('textae-event.resource.configuration.save', (editedData) => {
        this.configuration = editedData
      })
  }

  get defaultAnnotation() {
    return {
      text: 'Currently, the document is empty. Use the `import` button or press the key `i` to open a document with annotation.'
    }
  }

  get defaultConfiguration() {
    return patchConfiguration(this.defaultAnnotation)
  }

  /**
   * @returns { import("../../DataSource").default }
   */
  get annotation() {
    return this.#annotation ? this.#annotation.data : this.defaultAnnotation
  }

  /**
   * @param { import("../../DataSource").default } dataSource
   */
  set annotation(dataSource) {
    this.#annotationOnly = dataSource.data
    this.#statusBar.status = dataSource.displayName
    this.#eventEmitter.emit(
      'textae-event.original-data.annotation.reset',
      dataSource
    )
  }

  get configuration() {
    return this.#configuration ? this.#configuration : {}
  }

  set configuration(dataSource) {
    this.#configuration = dataSource.data
    this.#eventEmitter.emit('textae-event.original-data.configuration.reset')
  }

  set #annotationOnly(annotation) {
    this.#annotation = annotation
    if (annotation.config) {
      this.#configuration = annotation.config
    }
  }
}
