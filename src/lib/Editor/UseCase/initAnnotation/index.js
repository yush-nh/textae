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
  menuState,
  originalData,
  startUpOptions,
  functionAvailability
) {
  switch (startUpOptions.resourceType) {
    case RESOURCE_TYPE.QUERY_PARAMETER:
      setLoadedAnnotation(
        DataSource.createParameterSource(startUpOptions.annotation),
        startUpOptions.config,
        remoteResource,
        menuState,
        spanConfig,
        annotationModel,
        functionAvailability,
        originalData
      )
      break
    case RESOURCE_TYPE.INLINE:
      setLoadedAnnotation(
        DataSource.createInlineSource(startUpOptions.annotation),
        startUpOptions.config,
        remoteResource,
        menuState,
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
      if (startUpOptions.config) {
        remoteResource.loadConfiguration(startUpOptions.config)
      } else {
        setDefault(
          originalData,
          menuState,
          spanConfig,
          annotationModel,
          functionAvailability
        )
      }
  }
}
