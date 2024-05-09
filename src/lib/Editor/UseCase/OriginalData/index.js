import StatusBar from './StatusBar'
import DataSource from '../../DataSource'
import patchConfiguration from '../patchConfiguration'

// Manage the original annotations and the original configuration and merge the changes when you save them.
export default class OriginalData {
  #eventEmitter
  #statusBar
  #map

  constructor(eventEmitter, editorHTMLElement, isShow) {
    this.#eventEmitter = eventEmitter
    this.#statusBar = new StatusBar(editorHTMLElement, isShow)
    this.#map = new Map()

    eventEmitter
      .on('textae-event.resource.annotation.save', (editedData) => {
        console.log('aaaaa', editedData)
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

  get annotation() {
    return this.#map.has('annotation')
      ? this.#map.get('annotation').data
      : this.defaultAnnotation
  }

  set annotation(dataSource) {
    this.#map.set('annotation', dataSource)
    if (dataSource.data.config) {
      this.configuration = new DataSource(null, null, dataSource.data.config)
    }

    if (dataSource.type) {
      this.#statusBar.status = dataSource
    }
  }

  get configuration() {
    return this.#map.has('configuration')
      ? this.#map.get('configuration').data
      : {}
  }

  set configuration(dataSource) {
    this.#map.set('configuration', dataSource)
    this.#eventEmitter.emit('textae-event.original-data.configuration.reset')
  }
}
