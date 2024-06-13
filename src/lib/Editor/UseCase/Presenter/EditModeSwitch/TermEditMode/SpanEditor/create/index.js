import createCommand from './createCommand'
import getNewSpan from '../../../getNewSpan'

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
    annotationModel.spanInstanceContainer.validateNewDenotationSpan(begin, end)
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
