import { RESOURCE_TYPE } from '../../RESOURCE_TYPE.js'

export default class LastLoadedURL {
  #annotation
  #configuration

  constructor(eventEmitter) {
    // The configuration validation is done with setConfigAndAnnotation
    // because it requires both configuration and annotation.
    // The URL is set after the validation.
    eventEmitter
      .on('textae-event.original-data.annotation.reset', (dataSource) => {
        if (dataSource.resourceType === RESOURCE_TYPE.REMOTE_URL) {
          this.#annotation = dataSource.id
        }
      })
      .on('textae-event.original-data.configuration.reset', (dataSource) => {
        if (dataSource.resourceType === RESOURCE_TYPE.REMOTE_URL) {
          this.#configuration = dataSource.id
        }
      })
  }

  get annotation() {
    return this.#annotation || ''
  }

  get configuration() {
    return this.#configuration || ''
  }
}
