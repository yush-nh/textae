export default function (commander, newSpan, isReplicateAuto, isDelimiterFunc) {
  return commander.factory.createSpanWithTouchDeviceAndAutoReplicateCommand(
    {
      begin: newSpan.begin,
      end: newSpan.end
    },
    isReplicateAuto,
    isDelimiterFunc
  )
}
