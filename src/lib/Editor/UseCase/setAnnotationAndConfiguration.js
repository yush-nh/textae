/**
 *
 * @param {import('./MenuState').MenuState} menuState
 * @param {import('../AnnotationModel').AnnotationModel} annotationModel
 */
export default function setAnnotationAndConfiguration(
  validConfig,
  menuState,
  spanConfig,
  annotationModel,
  annotation,
  functionAvailability
) {
  menuState.setPushButtons(validConfig)
  spanConfig.set(validConfig)
  annotationModel.reset(annotation, validConfig)
  functionAvailability.availability = validConfig['function availability']
}
