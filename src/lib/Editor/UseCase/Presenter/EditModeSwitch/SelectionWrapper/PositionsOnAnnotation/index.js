import getOffsetFromParent from './getOffsetFromParent'
import getParentOffset from './getParentOffset'

export default class PositionsOnAnnotation {
  #spanModelContainer
  #selection

  constructor(spanModelContainer, selectionWrapper) {
    this.#spanModelContainer = spanModelContainer
    this.#selection = selectionWrapper.selection
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
    if (this.anchor < this.focus) {
      return this.anchor
    }

    return this.focus
  }

  get end() {
    if (this.anchor < this.focus) {
      return this.focus
    }

    return this.anchor
  }
}
