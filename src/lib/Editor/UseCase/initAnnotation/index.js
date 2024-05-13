import DataSource from '../../DataSource.js'
import { RESOURCE_TYPE } from '../../RESOURCE_TYPE.js'
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
    case RESOURCE_TYPE.QUERY_PARAMETER:
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
    case RESOURCE_TYPE.INLINE:
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
    case RESOURCE_TYPE.REMOTE_URL:
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
