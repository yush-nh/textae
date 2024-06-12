import createCommand from './createCommand'
import getNewSpan from '../../../getNewSpan'
import validateNewDenotationSpan from '../validateNewDenotationSpan'

export default function (
  sourceDoc,
  spanInstanceContainer,
  commander,
  spanAdjuster,
  isReplicateAuto,
  spanConfig,
  isDelimiterFunc
) {
  const { begin, end } = getNewSpan(
    sourceDoc,
    spanInstanceContainer,
    spanConfig,
    spanAdjuster
  )

  if (validateNewDenotationSpan(spanInstanceContainer, begin, end)) {
    const command = createCommand(
      commander,
      { begin, end },
      isReplicateAuto,
      isDelimiterFunc
    )

    commander.invoke(command)
  }
}
