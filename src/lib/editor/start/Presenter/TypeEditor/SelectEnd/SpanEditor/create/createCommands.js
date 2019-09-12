const BLOCK_THRESHOLD = 100

export default function(
  commander,
  typeDefinition,
  newSpan,
  isReplicateAuto,
  isDetectDelimiterEnable,
  spanConfig
) {
  const commands = commander.factory.spanCreateCommand(
    typeDefinition.entity.defaultType,
    {
      begin: newSpan.begin,
      end: newSpan.end
    }
  )
  if (isReplicateAuto && newSpan.end - newSpan.begin <= BLOCK_THRESHOLD) {
    commands.push(
      commander.factory.spanReplicateCommand(
        {
          begin: newSpan.begin,
          end: newSpan.end
        },
        [typeDefinition.entity.defaultType],
        isDetectDelimiterEnable ? spanConfig.isDelimiter : null
      )
    )
  }
  return commands
}
