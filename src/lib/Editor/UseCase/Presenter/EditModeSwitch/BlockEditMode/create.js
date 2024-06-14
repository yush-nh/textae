export default function (
  annotationModel,
  commander,
  textSelectionAdjuster,
  spanConfig
) {
  const { begin, end } = annotationModel.getNewSpan(
    spanConfig,
    textSelectionAdjuster
  )

  if (annotationModel.validateNewBlockSpan(begin, end)) {
    const command = commander.factory.createBlockSpanCommand({
      begin,
      end
    })

    commander.invoke(command)
  }
}
