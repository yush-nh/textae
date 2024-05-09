import StatusBar from './StatusBar'
import DataSource from '../../DataSource'
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
        this.annotation = new DataSource(null, null, editedData)
      })
      .on('textae-event.resource.configuration.save', (editedData) => {
        this.configuration = new DataSource(null, null, editedData)
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
    this.#annotation = dataSource
    if (dataSource.data.config) {
      this.configuration = new DataSource(null, null, dataSource.data.config)
    }

    if (dataSource.type) {
      this.#statusBar.status = dataSource.displayName
    }
  }

  get configuration() {
    return this.#configuration ? this.#configuration.data : {}
  }

  set configuration(dataSource) {
    this.#configuration = dataSource
    this.#eventEmitter.emit('textae-event.original-data.configuration.reset')
  }
}
