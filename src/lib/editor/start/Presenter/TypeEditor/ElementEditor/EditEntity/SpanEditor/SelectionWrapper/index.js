import isNodeSpan from '../../../isNodeSpan'
import isNodeTextBox from '../../../isNodeTextBox'
import isNodeStyleSpan from '../../../isNodeStyleSpan'
import getSelectionSnapShot from './getSelectionSnapShot'

export default class {
  constructor() {
    this.selection = getSelectionSnapShot()
  }

  isAnchorNodeIn(node) {
    return this.selection.anchorNode.parentNode === node
  }

  get isParentOfAnchorNodeAndFocusedNodeSame() {
    return (
      this.selection.anchorNode.parentElement ===
      this.selection.focusNode.parentElement
    )
  }

  get isAnchorNodeParentIsDescendantOfFocusNodeParent() {
    return this.parentOfAnchorNode.closest(`#${this.parentOfFocusNode.id}`)
  }

  get isFocusNodeParentIsDescendantOfAnchorNodeParent() {
    return this.parentOfFocusNode.closest(`#${this.parentOfAnchorNode.id}`)
  }

  get isFocusNodeParentIsDescendantOfAnchorNodeParentOfParent() {
    return this.parentOfFocusNode.closest(
      `#${this.parentOfAnchorNode.parentElement.id}`
    )
  }

  get isFocusNodeParentSelected() {
    return this.parentOfFocusNode.classList.contains('ui-selected')
  }

  get parentOfAnchorNode() {
    return this.selection.anchorNode.parentElement
  }

  get parentOfFocusNode() {
    return this.selection.focusNode.parentElement
  }

  get ancestorSpanOfAnchorNode() {
    return this.selection.anchorNode.parentElement.closest(
      '.textae-editor__span'
    )
  }

  get isAnchorNodeInTextBox() {
    return isNodeTextBox(this.selection.anchorNode.parentNode)
  }

  get isAnchorNodeInSpan() {
    return isNodeSpan(this.selection.anchorNode.parentNode)
  }

  get isAnchorNodeInStyleSpan() {
    return isNodeStyleSpan(this.selection.anchorNode.parentNode)
  }

  get isAnchorNodeInStyleSpanAndTheStyleSpanIsDescendantOfSpan() {
    return (
      isNodeStyleSpan(this.selection.anchorNode.parentNode) &&
      this.selection.anchorNode.parentElement.closest('.textae-editor__span')
    )
  }

  get isAnchorOneDownUnderFocus() {
    return (
      this.selection.anchorNode.parentNode.parentNode ===
      this.selection.focusNode.parentNode
    )
  }

  get isFocusNodeInTextBox() {
    return isNodeTextBox(this.selection.focusNode.parentNode)
  }

  get isFocusNodeInSpan() {
    return isNodeSpan(this.selection.focusNode.parentNode)
  }

  get isFocusNodeInStyleSpan() {
    return isNodeStyleSpan(this.selection.focusNode.parentNode)
  }
}
