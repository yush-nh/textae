import getControlXs from './getControlXs'
import getSourceAndTarget from './getSourceAndTarget'

export default class PathPoints {
  constructor(
    sourceEntity,
    targetEntity,
    alignSourceBollards,
    alignTargetBollards,
    clientTopOfContainer
  ) {
    const [source, target] = getSourceAndTarget(
      sourceEntity,
      targetEntity,
      alignSourceBollards,
      alignTargetBollards,
      clientTopOfContainer
    )

    const { sourceControlX, targetControlX } = getControlXs(
      source,
      target,
      sourceEntity.clientBottom,
      targetEntity.clientBottom
    )

    const controlY =
      Math.min(source.y, target.y) -
      Math.abs(target.x - source.x) / 4 -
      20 +
      (alignSourceBollards && alignTargetBollards ? 3 : 0)

    this.sourceY = source.y
    this.targetY = target.y
    this.controlY = controlY
    this.sourceX = source.x
    this.targetX = target.x
    this.sourceControlX = sourceControlX
    this.targetControlX = targetControlX
  }

  get pathCommands() {
    if (this.targetControlX !== this.targetX) {
      const additionalControlY = this.sourceY * 0.3 + this.targetY * 0.7

      return `M ${this.sourceX}, ${this.sourceY} C ${this.sourceControlX} ${
        this.controlY
      }, ${this.targetControlX} ${this.controlY}, ${
        this.targetControlX * 0.25 + this.targetX * 0.75
      } ${this.controlY * 0.25 + additionalControlY * 0.75} Q ${
        this.targetX
      } ${additionalControlY}, ${this.targetX} ${this.targetY}`
    }

    if (this.sourceControlX !== this.sourceX) {
      const additionalControlY = this.sourceY * 0.7 + this.targetY * 0.3

      return `M ${this.sourceX}, ${this.sourceY} Q ${
        this.sourceX
      } ${additionalControlY}, ${
        this.sourceControlX * 0.25 + this.sourceX * 0.75
      } ${this.controlY * 0.25 + additionalControlY * 0.75} C ${
        this.sourceControlX
      } ${this.controlY}, ${this.targetControlX} ${this.controlY}, ${
        this.targetX
      } ${this.targetY}`
    }

    return `M ${this.sourceX}, ${this.sourceY} C ${this.sourceControlX} ${this.controlY}, ${this.targetControlX} ${this.controlY}, ${this.targetX} ${this.targetY}`
  }

  get transformDefinitionsForSourceTriangle() {
    return `translate(${this.sourceX}, ${this.sourceY})`
  }

  get transformDefinitionsForTargetTriangle() {
    return `translate(${this.targetX}, ${this.targetY})`
  }

  get isBentSignificantly() {
    return this.sourceControlX !== this.sourceX
  }

  getTForY(top) {
    const sample = 20

    // https://ja.javascript.info/bezier-curve
    // (1−t)3P1 + 3(1−t)2tP2 +3(1−t)t2P3 + t3P4
    const { sourceY, targetY, controlY } = this

    if (this.targetControlX !== this.targetX) {
      const additionalControlY = this.sourceY * 0.3 + this.targetY * 0.7

      return [...Array(sample).keys()]
        .map((i) => (i * 1) / sample)
        .find((t) => {
          const labelY =
            Math.pow(1 - t, 3) * sourceY +
            3 * Math.pow(1 - t, 2) * t * controlY +
            3 * (1 - t) * Math.pow(t, 2) * controlY +
            Math.pow(t, 3) * (this.controlY * 0.25 + additionalControlY * 0.75)
          return Math.abs(labelY - top) < 1
        })
    }

    return [...Array(sample).keys()]
      .map((i) => (i * 1) / sample)
      .find((t) => {
        const labelY =
          Math.pow(1 - t, 3) * sourceY +
          3 * Math.pow(1 - t, 2) * t * controlY +
          3 * (1 - t) * Math.pow(t, 2) * controlY +
          Math.pow(t, 3) * targetY
        return Math.abs(labelY - top) < 1
      })
  }

  getXOnT(_t) {
    const { sourceX, targetX, sourceControlX, targetControlX } = this

    return (
      Math.pow(1 - _t, 3) * sourceX +
      3 * Math.pow(1 - _t, 2) * _t * sourceControlX +
      3 * (1 - _t) * Math.pow(_t, 2) * targetControlX +
      Math.pow(_t, 3) * targetX
    )
  }
}
