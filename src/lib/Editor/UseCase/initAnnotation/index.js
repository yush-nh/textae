import alertifyjs from 'alertifyjs'
import setAnnotationAndConfiguration from '../setAnnotationAndConfiguration.js'
import validateConfigurationAndAlert from '../validateConfigurationAndAlert/index.js'
import warningIfBeginEndOfSpanAreNotInteger from '../warningIfBeginEndOfSpanAreNotInteger/index.js'
import DataSource from '../../DataSource/index.js'
import setDefault from './setDefault.js'

/**
 *
 * @param {import('../../HTMLInlineOptions/index.js').default})} inlineOptions
 */
export default function (
  spanConfig,
  annotationModel,
  remoteResource,
  controlViewModel,
  originalData,
  inlineOptions,
  functionAvailability
) {
  if (inlineOptions.annotation) {
    // Set an inline annotation.
    const dataSource = DataSource.createInlineSource(inlineOptions.annotation)

    if (!dataSource.data.config && inlineOptions.configParameter) {
      remoteResource.loadConfiguration(
        inlineOptions.configParameter,
        dataSource
      )
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
  } else if (inlineOptions.annotationURL) {
    // Load an annotation from server.
    remoteResource.loadAnnotation(inlineOptions.annotationURL)
  } else {
    if (inlineOptions.configParameter) {
      remoteResource.loadConfiguration(inlineOptions.configParameter)
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
