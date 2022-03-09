import ArchedCurveAlgorithm from './ArchedCurveAlgorithm'

export default class CutOffOnTargetArchedCurveAlgorithm extends ArchedCurveAlgorithm {
  get isSourceJettyVisible() {
    return true
  }

  get isTargetJettyVisible() {
    return false
  }

  get targetX() {
    return (
      super.targetX -
      this._virtualEntityWidth / 2 +
      this._virtualEntityWidth * this._startAndEnd.targetXShiftRate
    )
  }

  get targetY() {
    const { clientHeight } = document.documentElement
    const offsetBottomOfContainer = clientHeight - this._clientTopOfContainer

    return offsetBottomOfContainer - 8
  }
}
