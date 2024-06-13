export default function (annotationModel, commander, spanAdjuster, spanConfig) {
  const { begin, end } = annotationModel.getNewSpan(spanConfig, spanAdjuster)

  if (annotationModel.validateNewBlockSpan(begin, end)) {
    const command = commander.factory.createBlockSpanCommand({
      begin,
      end
    })

    commander.invoke(command)
  }
}
