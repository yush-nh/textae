import LoadDialog from '../../../component/LoadDialog'
import SaveAnnotationDialog from '../../../component/SaveAnnotationDialog'
import SaveConfigurationDialog from '../../../component/SaveConfigurationDialog'
import readAnnotationFile from './readAnnotationFile'
import readConfigurationFile from './readConfigurationFile'
import DataSource from '../../DataSource'
import isJSON from '../../../isJSON'
import readAnnotationText from './readAnnotationText'
import LastLoadedURL from './LastLoadedURL.js'
import LastLoadedFilename from './LastLoadedFilename.js'

export default class PersistenceInterface {
  #eventEmitter
  #remoteResource
  #annotationModel
  #getOriginalAnnotation
  #getOriginalConfig
  #saveToParameter
  #annotationModelEventsObserver
  #menuState
  #lastLoadedURL
  #lastLoadedFilename

  /**
   *
   * @param {import('../../RemoteResource/index.js').default} remoteResource
   */
  constructor(
    eventEmitter,
    remoteResource,
    annotationModel,
    getOriginalAnnotation,
    getOriginalConfig,
    saveToParameter,
    annotationModelEventsObserver,
    menuState
  ) {
    this.#eventEmitter = eventEmitter
    this.#remoteResource = remoteResource
    this.#annotationModel = annotationModel
    this.#getOriginalAnnotation = getOriginalAnnotation
    this.#getOriginalConfig = getOriginalConfig
    this.#saveToParameter = saveToParameter
    this.#annotationModelEventsObserver = annotationModelEventsObserver
    this.#menuState = menuState
    this.#lastLoadedURL = new LastLoadedURL(eventEmitter)
    this.#lastLoadedFilename = new LastLoadedFilename(eventEmitter)

    eventEmitter
      .on('textae-event.pallet.import-button.click', () =>
        this.importConfiguration()
      )
      .on('textae-event.pallet.upload-button.click', () =>
        this.uploadConfiguration()
      )
  }

  importAnnotation() {
    new LoadDialog(
      'Load Annotations',
      this.#lastLoadedURL.annotation,
      (url) => this.#remoteResource.loadAnnotation(url),
      (file) => readAnnotationFile(file, this.#eventEmitter),
      (text) => {
        if (readAnnotationText(this.#eventEmitter, text)) {
          return
        }

        this.#eventEmitter.emit(
          'textae-event.resource.annotation.format.error',
          DataSource.createInstantSource()
        )
      },
      this.#annotationModelEventsObserver.hasChange
    ).open()
  }

  uploadAnnotation() {
    const url =
      this.#saveToParameter ||
      this.#lastLoadedURL.annotation ||
      'https://pubannotatoin.org/annotations.json' // Default destination URL

    new SaveAnnotationDialog(
      this.#eventEmitter,
      url,
      this.#lastLoadedFilename.annotation,
      this.#editedAnnotation,
      (url) => this.#remoteResource.saveAnnotation(url, this.#editedAnnotation)
    ).open()
  }

  saveAnnotation() {
    this.#remoteResource.saveAnnotation(
      this.#saveToParameter || this.#lastLoadedURL.annotation,
      this.#editedAnnotation
    )
  }

  importConfiguration() {
    new LoadDialog(
      'Load Configurations',
      this.#lastLoadedURL.configuration,
      (url) => this.#remoteResource.loadConfiguration(url),
      (file) => readConfigurationFile(file, this.#eventEmitter),
      (text) => {
        if (isJSON(text)) {
          this.#eventEmitter.emit(
            'textae-event.resource.configuration.load.success',
            DataSource.createInstantSource(JSON.parse(text))
          )
        } else {
          this.#eventEmitter.emit(
            'textae-event.resource.configuration.format.error',
            DataSource.createInstantSource()
          )
        }
      },
      this.#menuState.diffOfConfiguration
    ).open()
  }

  uploadConfiguration() {
    // Merge with the original config and save the value unchanged in the editor.
    const editedConfig = {
      ...this.#getOriginalConfig(),
      ...this.#getActualNewConfig()
    }

    new SaveConfigurationDialog(
      this.#eventEmitter,
      this.#lastLoadedURL.configuration,
      this.#lastLoadedFilename.configuration,
      this.#getOriginalConfig(),
      editedConfig,
      (url) => this.#remoteResource.saveConfiguration(url, editedConfig)
    ).open()
  }

  get #editedAnnotation() {
    const annotation = {
      ...this.#getOriginalAnnotation(),
      ...this.#annotationModel.externalFormat,
      ...{
        config: this.#annotationModel.typeDictionary.config
      }
    }

    // Track annotations are merged into root annotations.
    delete annotation.tracks

    return annotation
  }

  #getActualNewConfig() {
    const originalConfig = this.#getOriginalConfig()
    const newConfig = this.#annotationModel.typeDictionary.config

    const originalAttributeTypes = originalConfig['attribute types']
    const newAttributeTypes = newConfig['attribute types']

    if (originalAttributeTypes?.length && newAttributeTypes?.length) {
      /**
       * Remove `values` property from `newConfig` if it was not present in `originalConfig` and only an empty array is provided.
       * This happens when saving a configuration:
       * - If an attribute does not have `values` in the original config,
       *   an empty `values` array may be added to `newConfig` during the saving process.
       * - Since this does not represent an actual semantic change, delete this empty `values` property
       *   from `newConfig` to avoid creating unnecessary diffs.
       */

      for (let i = 0; i < originalAttributeTypes.length; i++) {
        const isOriginalValueBlank = !Object.prototype.hasOwnProperty.call(
          originalAttributeTypes[i],
          'values'
        )
        const isNewValueEmptyArray =
          newAttributeTypes[i]['values']?.length === 0

        if (isOriginalValueBlank && isNewValueEmptyArray) {
          delete newConfig['attribute types'][i]['values']
        }
      }
    }

    return newConfig
  }
}
