import { RESOURCE_TYPE } from '../../RESOURCE_TYPE.js'

export default class LastLoadedFilename {
  #annotation
  #configuration

  constructor(eventEmitter) {
    eventEmitter
      .on('textae-event.original-data.annotation.reset', (dataSource) => {
        if (dataSource.resourceType === RESOURCE_TYPE.LOCAL_FILE) {
          this.#annotation = dataSource.id
        }
      })
      .on('textae-event.original-data.configuration.reset', (dataSource) => {
        if (dataSource.resourceType === RESOURCE_TYPE.LOCAL_FILE) {
          this.#configuration = dataSource.id
        }
      })
  }

  get annotation() {
    return this.#annotation
  }

  get configuration() {
    return this.#configuration
  }
}
