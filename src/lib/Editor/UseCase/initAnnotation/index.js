import DataSource from '../../DataSource.js'
import setDefault from './setDefault.js'
import setLoadedAnnotation from './setLoadedAnnotation.js'

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
    case 'parameter':
      setLoadedAnnotation(
        DataSource.createParameterSource(startUpOptions.annotation),
        startUpOptions.configParameter,
        remoteResource,
        controlViewModel,
        spanConfig,
        annotationModel,
        functionAvailability,
        originalData
      )
      break
    case 'inline':
      setLoadedAnnotation(
        DataSource.createInlineSource(startUpOptions.annotation),
        startUpOptions.configParameter,
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
