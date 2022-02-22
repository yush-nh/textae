import { MinimumDistance, DistanceToShift } from './determineXPositions'

export default function (
  sourceEntity,
  targetEntity,
  alignSourceBollards,
  alignTargetBollards
) {
  // When the entity width is small and the endpoint is displayed in the center of the entity and the entity has only one endpoint,
  // hovering will not move the entity left or right.
  const isSourceJettyDeployed =
    sourceEntity.width / 2 >= MinimumDistance ||
    (sourceEntity.hasMultipleEndpoints && alignSourceBollards)

  const isTargetJettyDeployed =
    targetEntity.width / 2 >= MinimumDistance ||
    (targetEntity.hasMultipleEndpoints && alignTargetBollards)

  const centerOfSource = sourceEntity.offsetCenter
  const centerOfTarget = targetEntity.offsetCenter

  const leftTarget = isTargetJettyDeployed
    ? centerOfTarget - DistanceToShift
    : centerOfTarget
  const leftSource = isSourceJettyDeployed
    ? centerOfSource - DistanceToShift * 3
    : centerOfSource
  const rightTarget = isTargetJettyDeployed
    ? centerOfTarget + DistanceToShift
    : centerOfTarget
  const rightSource = isSourceJettyDeployed
    ? centerOfSource + DistanceToShift * 3
    : centerOfSource

  return {
    source: { left: leftSource, right: rightSource, center: centerOfSource },
    target: { left: leftTarget, right: rightTarget, center: centerOfTarget }
  }
}
