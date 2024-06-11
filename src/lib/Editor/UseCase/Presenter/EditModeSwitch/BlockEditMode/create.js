import getNewSpan from '../getNewSpan'
import validateNewBlockSpan from './validateNewBlockSpan'

export default function (
  annotationModel,
  commander,
  spanAdjuster,
  selectionWrapper,
  spanConfig
) {
  const { begin, end } = getNewSpan(
    annotationModel.sourceDoc,
    annotationModel.span,
    spanAdjuster,
    spanConfig
  )

  if (validateNewBlockSpan(annotationModel, begin, end)) {
    const command = commander.factory.createBlockSpanCommand({
      begin,
      end
    })

    commander.invoke(command)
  }
}
