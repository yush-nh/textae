import getOffsetFromParent from './getOffsetFromParent'
import getParentOffset from './getParentOffset'

export default class TextSelection {
  #selection
  #spanInstanceContainer

  constructor(spanInstanceContainer) {
    this.#selection = window.getSelection()
    this.#spanInstanceContainer = spanInstanceContainer
  }

  get anchor() {
    const position =
      getParentOffset(this.#spanInstanceContainer, this.#selection.anchorNode) +
      getOffsetFromParent(this.#selection.anchorNode)

    return position + this.#selection.anchorOffset
  }

  get focus() {
    const position =
      getParentOffset(this.#spanInstanceContainer, this.#selection.focusNode) +
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
