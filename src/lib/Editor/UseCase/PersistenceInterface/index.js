import LoadDialog from '../../../component/LoadDialog'
import SaveAnnotationDialog from '../../../component/SaveAnnotationDialog'
import SaveConfigurationDialog from '../../../component/SaveConfigurationDialog'
import readAnnotationFile from './readAnnotationFile'
import readConfigurationFile from './readConfigurationFile'
import DataSource from '../../DataSource'
import isJSON from '../../../isJSON'
import readAnnotationText from './readAnnotationText'

export default class PersistenceInterface {
  #eventEmitter
  #remoteResource
  #annotationModel
  #getOriginalAnnotation
  #getOriginalConfig
  #saveToParameter
  #annotationModelEventsObserver
  #controlViewModel
  #filenameOfLastRead

  constructor(
    eventEmitter,
    remoteResource,
    annotationModel,
    getOriginalAnnotation,
    getOriginalConfig,
    saveToParameter,
    annotationModelEventsObserver,
    controlViewModel
  ) {
    this.#eventEmitter = eventEmitter
    this.#remoteResource = remoteResource
    this.#annotationModel = annotationModel
    this.#getOriginalAnnotation = getOriginalAnnotation
    this.#getOriginalConfig = getOriginalConfig
    this.#saveToParameter = saveToParameter
    this.#annotationModelEventsObserver = annotationModelEventsObserver
    this.#controlViewModel = controlViewModel

    // Store the filename of the annotation and configuration.
    this.#filenameOfLastRead = {
      annotation: '',
      configuration: ''
    }

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
      this.#remoteResource.annotationURL,
      (url) => this.#remoteResource.loadAnnotation(url),
      (file) => {
        readAnnotationFile(file, this.#eventEmitter)
        this.#filenameOfLastRead.annotation = file.name
      },
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
      this.#remoteResource.annotationURL ||
      'https://pubannotatoin.org/annotations.json' // Default destination URL

    new SaveAnnotationDialog(
      this.#eventEmitter,
      url,
      this.#filenameOfLastRead.annotation,
      this.#editedAnnotation,
      (url) => this.#remoteResource.saveAnnotation(url, this.#editedAnnotation)
    ).open()
  }

  saveAnnotation() {
    this.#remoteResource.saveAnnotation(
      this.#saveToParameter || this.#remoteResource.annotationURL,
      this.#editedAnnotation
    )
  }

  importConfiguration() {
    new LoadDialog(
      'Load Configurations',
      this.#remoteResource.configurationURL,
      (url) => this.#remoteResource.loadConfiguration(url),
      (file) => {
        readConfigurationFile(file, this.#eventEmitter)
        this.#filenameOfLastRead.configuration = file.name
      },
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
      this.#controlViewModel.diffOfConfiguration
    ).open()
  }

  uploadConfiguration() {
    // Merge with the original config and save the value unchanged in the editor.
    const editedConfig = {
      ...this.#getOriginalConfig(),
      ...this.#annotationModel.typeDefinition.config
    }

    new SaveConfigurationDialog(
      this.#eventEmitter,
      this.#remoteResource.configurationURL,
      this.#filenameOfLastRead.configuration,
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
        config: this.#annotationModel.typeDefinition.config
      }
    }

    // Track annotations are merged into root annotations.
    delete annotation.tracks

    return annotation
  }
}
