import setAnnotationAndConfiguration from '../setAnnotationAndConfiguration'

export default function setDefault(
  originalData,
  menuState,
  spanConfig,
  annotationModel,
  functionAvailability
) {
  setAnnotationAndConfiguration(
    originalData.defaultConfiguration,
    menuState,
    spanConfig,
    annotationModel,
    originalData.defaultAnnotation,
    functionAvailability
  )
}
