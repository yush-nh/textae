import alertifyjs from 'alertifyjs'
import patchConfiguration from '../patchConfiguration'
import validateConfiguration from './validateConfiguration'
import validateAttributeDefinitionAndAlert from '../validateAttributeDefinitionAndAlert'

export default function (annotation, config) {
  const patchedConfig = patchConfiguration(annotation, config)
  const errorMessage = validateConfiguration(patchedConfig)
  if (errorMessage) {
    alertifyjs.error(errorMessage)

    return
  }

  return validateAttributeDefinitionAndAlert(annotation, patchedConfig)
}
