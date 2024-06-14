import createCommand from './createCommand'

export default function (
  annotationModel,
  commander,
  textSelectionAdjuster,
  isReplicateAuto,
  spanConfig,
  isDelimiterFunc
) {
  const { begin, end } = annotationModel.getNewSpan(
    spanConfig,
    textSelectionAdjuster
  )

  if (annotationModel.validateNewDenotationSpan(begin, end)) {
    const command = createCommand(
      commander,
      { begin, end },
      isReplicateAuto,
      isDelimiterFunc
    )

    commander.invoke(command)
  }
}
