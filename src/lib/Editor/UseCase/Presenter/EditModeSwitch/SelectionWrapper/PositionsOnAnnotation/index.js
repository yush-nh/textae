import OrderedPositions from '../OrderedPositions'
import getOffsetFromParent from './getOffsetFromParent'
import getParentOffset from './getParentOffset'

export default class PositionsOnAnnotation {
  #spanModelContainer
  #selection
  #orderedPositions

  constructor(spanModelContainer, selectionWrapper) {
    this.#spanModelContainer = spanModelContainer
    this.#selection = selectionWrapper.selection
    this.#orderedPositions = new OrderedPositions(this)
  }

  get anchor() {
    const position =
      getParentOffset(this.#spanModelContainer, this.#selection.anchorNode) +
      getOffsetFromParent(this.#selection.anchorNode)

    return position + this.#selection.anchorOffset
  }

  get focus() {
    const position =
      getParentOffset(this.#spanModelContainer, this.#selection.focusNode) +
      getOffsetFromParent(this.#selection.focusNode)

    return position + this.#selection.focusOffset
  }

  get begin() {
    return this.#orderedPositions.begin
  }

  get end() {
    return this.#orderedPositions.end
  }
}
