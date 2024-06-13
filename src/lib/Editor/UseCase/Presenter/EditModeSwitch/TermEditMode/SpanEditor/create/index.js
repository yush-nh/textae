import createCommand from './createCommand'
import getNewSpan from '../../../getNewSpan'
import validateNewDenotationSpan from '../validateNewDenotationSpan'

export default function (
  annotationModel,
  commander,
  spanAdjuster,
  isReplicateAuto,
  spanConfig,
  isDelimiterFunc
) {
  const { begin, end } = getNewSpan(annotationModel, spanConfig, spanAdjuster)

  if (
    validateNewDenotationSpan(annotationModel.spanInstanceContainer, begin, end)
  ) {
    const command = createCommand(
      commander,
      { begin, end },
      isReplicateAuto,
      isDelimiterFunc
    )

    commander.invoke(command)
  }
}
