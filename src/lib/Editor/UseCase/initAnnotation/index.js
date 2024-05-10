import alertifyjs from 'alertifyjs'
import setAnnotationAndConfiguration from '../setAnnotationAndConfiguration.js'
import validateConfigurationAndAlert from '../validateConfigurationAndAlert/index.js'
import warningIfBeginEndOfSpanAreNotInteger from '../warningIfBeginEndOfSpanAreNotInteger/index.js'
import DataSource from '../../DataSource/index.js'
import setDefault from './setDefault.js'

/**
 *
 * @param {import('../../StartUpOptions/index.js').default)} startUpOptions
 */
export default function (
  spanConfig,
  annotationModel,
  remoteResource,
  controlViewModel,
  originalData,
  startUpOptions,
  functionAvailability
) {
  switch (startUpOptions.resourceType) {
    case 'inline':
      setInlineAnnotation(
        startUpOptions,
        remoteResource,
        controlViewModel,
        spanConfig,
        annotationModel,
        functionAvailability,
        originalData
      )
      break
    case 'remote':
      // Load an annotation from server.
      remoteResource.loadAnnotation(startUpOptions.annotationURL)
      break
    default:
      if (startUpOptions.configParameter) {
        remoteResource.loadConfiguration(startUpOptions.configParameter)
      } else {
        setDefault(
          originalData,
          controlViewModel,
          spanConfig,
          annotationModel,
          functionAvailability
        )
      }
  }
}

function setInlineAnnotation(
  startUpOptions,
  remoteResource,
  controlViewModel,
  spanConfig,
  annotationModel,
  functionAvailability,
  originalData
) {
  // Set an inline annotation.
  const dataSource = DataSource.createInlineSource(startUpOptions.annotation)

  if (!dataSource.data.config && startUpOptions.configParameter) {
    remoteResource.loadConfiguration(startUpOptions.configParameter, dataSource)
  } else {
    warningIfBeginEndOfSpanAreNotInteger(dataSource.data)

    if (dataSource.data.config) {
      // When config is specified, it must be JSON.
      // For example, when we load an HTML file, we treat it as text here.
      if (typeof dataSource.data.config !== 'object') {
        alertifyjs.error(`configuration in annotation file is invalid.`)
        return
      }
    }

    const validConfig = validateConfigurationAndAlert(
      dataSource.data,
      dataSource.data.config
    )

    if (validConfig) {
      setAnnotationAndConfiguration(
        validConfig,
        controlViewModel,
        spanConfig,
        annotationModel,
        dataSource.data,
        functionAvailability
      )

      originalData.annotation = dataSource
    }
  }
}
