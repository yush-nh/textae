export default function (commander, newSpan, isReplicateAuto, isDelimiterFunc) {
  return commander.factory.createSpanAndAutoReplicateCommand(
    newSpan,
    isReplicateAuto,
    isDelimiterFunc
  )
}
