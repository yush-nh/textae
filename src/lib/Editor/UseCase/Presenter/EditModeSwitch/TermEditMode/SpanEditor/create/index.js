import createCommand from './createCommand'
import getNewSpan from '../../../getNewSpan'
import validateNewDenotationSpan from '../validateNewDenotationSpan'

export default function (
  sourceDoc,
  spanModelContainer,
  commander,
  spanAdjuster,
  isReplicateAuto,
  spanConfig,
  isDelimiterFunc
) {
  const { begin, end } = getNewSpan(
    sourceDoc,
    spanModelContainer,
    spanAdjuster,
    spanConfig
  )

  if (validateNewDenotationSpan(spanModelContainer, begin, end)) {
    const command = createCommand(
      commander,
      { begin, end },
      isReplicateAuto,
      isDelimiterFunc
    )

    commander.invoke(command)
  }
}
