import createCommand from './createCommand'
import getNewSpan from '../../../getNewSpan'
import validateNewDenotationSpan from '../validateNewDenotationSpan'

export default function (
  sourceDoc,
  spanModelContainer,
  commander,
  spanAdjuster,
  isReplicateAuto,
  selectionWrapper,
  spanConfig,
  isDelimiterFunc
) {
  const { begin, end } = getNewSpan(
    sourceDoc,
    spanAdjuster,
    selectionWrapper,
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
