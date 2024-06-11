import alertifyjs from 'alertifyjs'
import clearTextSelection from '../../clearTextSelection'
import create from './create'
import shrinkSpan from '../../shrinkSpan'
import hasCharacters from '../../hasCharacters'
import getIsDelimiterFunc from '../../../getIsDelimiterFunc'
import SelectionWrapper from '../../SelectionWrapper'
import isPositionBetweenSpan from './isPositionBetweenSpan'
import getRightSpanElement from '../../../../../getRightSpanElement'
import validateNewDenotationSpan from './validateNewDenotationSpan'

export default class SpanEditor {
  #editorHTMLElement
  #annotationModel
  #spanModelContainer
  #selectionModel
  #commander
  #menuState
  #spanConfig

  constructor(
    editorHTMLElement,
    annotationModel,
    selectionModel,
    commander,
    menuState,
    spanConfig
  ) {
    this.#editorHTMLElement = editorHTMLElement
    this.#annotationModel = annotationModel
    this.#spanModelContainer = annotationModel.span
    this.#selectionModel = selectionModel
    this.#commander = commander
    this.#menuState = menuState
    this.#spanConfig = spanConfig
  }

  editFor(selectionWrapper) {
    if (selectionWrapper.isParentOfAnchorNodeTextBox) {
      if (selectionWrapper.isParentOfFocusNodeTextBox) {
        this.#anchorNodeInTextBoxFocusNodeInTextBox(selectionWrapper)
        return
      }
      if (selectionWrapper.isParentOfFocusNodeDenotationSpan) {
        this.#anchorNodeInTextBoxFocusNodeInDenotationSpan(selectionWrapper)
        return
      }
      if (selectionWrapper.isParentOfFocusNodeBlockSpan) {
        this.#anchorNodeInTextBoxFocusNodeInBlockSpan(selectionWrapper)
        return
      }
      if (selectionWrapper.isParentOfFocusNodeStyleSpan) {
        this.#anchorNodeInTextBoxFocusNodeInStyleSpan(selectionWrapper)
        return
      }
    }
    if (selectionWrapper.isParentOfAnchorNodeDenotationSpan) {
      if (selectionWrapper.isParentOfFocusNodeTextBox) {
        this.#anchorNodeInDenotationSpanFocusNodeInTextBox(selectionWrapper)
        return
      }
      if (selectionWrapper.isParentOfFocusNodeDenotationSpan) {
        this.#anchorNodeInDenotationSpanFocusNodeInDenotationSpan(
          selectionWrapper
        )
        return
      }
      if (selectionWrapper.isParentOfFocusNodeBlockSpan) {
        this.#anchorNodeInDenotationSpanFocusNodeInBlockSpan(selectionWrapper)
        return
      }
      if (selectionWrapper.isParentOfFocusNodeStyleSpan) {
        this.#anchorNodeInDenotationSpanFocusNodeInStyleSpan(selectionWrapper)
        return
      }
    }
    if (selectionWrapper.isParentOfAnchorNodeBlockSpan) {
      if (selectionWrapper.isParentOfFocusNodeTextBox) {
        this.#anchorNodeInBlockSpanFocusNodeInTextBox(selectionWrapper)
        return
      }
      if (selectionWrapper.isParentOfFocusNodeDenotationSpan) {
        this.#anchorNodeInBlockSpanFocusNodeInDenotationSpan(selectionWrapper)
        return
      }
      if (selectionWrapper.isParentOfFocusNodeBlockSpan) {
        this.#anchorNodeInBlockSpanFocusNodeInBlockSpan(selectionWrapper)
        return
      }
      if (selectionWrapper.isParentOfFocusNodeStyleSpan) {
        this.#anchorNodeInBlockSpanFocusNodeInStyleSpan(selectionWrapper)
        return
      }
    }
    if (selectionWrapper.isParentOfAnchorNodeStyleSpan) {
      if (selectionWrapper.isParentOfFocusNodeTextBox) {
        this.#anchorNodeInStyleSpanFocusNodeInTextBox(selectionWrapper)
        return
      }
      if (selectionWrapper.isParentOfFocusNodeDenotationSpan) {
        this.#anchorNodeInStyleSpanFocusNodeInDenotationSpan(selectionWrapper)
        return
      }
      if (selectionWrapper.isParentOfFocusNodeBlockSpan) {
        this.#anchorNodeInStyleSpanFocusNodeInBlockSpan(selectionWrapper)
        return
      }
      if (selectionWrapper.isParentOfFocusNodeStyleSpan) {
        this.#anchorNodeInStyleSpanFocusNodeInStyleSpan(selectionWrapper)
        return
      }
    }
  }

  cerateSpanForTouchDevice() {
    const selectionWrapper = new SelectionWrapper(this.#spanModelContainer)

    if (selectionWrapper.isParentOfBothNodesSame) {
      this.#create(selectionWrapper)
    }
  }

  expandForTouchDevice() {
    const expandedSpan = this.#getExpandedSpanForTouchDevice()
    if (expandedSpan) {
      const { spanID, begin, end } = expandedSpan

      // The span cross exists spans.
      if (
        this.#spanModelContainer.isBoundaryCrossingWithOtherSpans(begin, end)
      ) {
        return
      }

      // A span cannot be expanded a span to the same as an existing span.
      if (this.#spanModelContainer.hasDenotationSpan(begin, end)) {
        return
      }

      this.#commander.invoke(
        this.#commander.factory.moveDenotationSpanCommand(spanID, begin, end)
      )
    }
  }

  shrinkForTouchDevice() {
    const shrunkenSpan = this.#getShrunkenSpanForTouchDevice()
    if (shrunkenSpan) {
      const { spanID, begin, end } = shrunkenSpan
      const nextSpan = getRightSpanElement(this.#editorHTMLElement, spanID)

      // The span cross exists spans.
      if (
        this.#spanModelContainer.isBoundaryCrossingWithOtherSpans(begin, end)
      ) {
        alertifyjs.warning(
          'A span cannot be shrunken to make a boundary crossing.'
        )
        return
      }

      const doesExists = this.#spanModelContainer.hasDenotationSpan(begin, end)
      if (begin < end && !doesExists) {
        this.#commander.invoke(
          this.#commander.factory.moveDenotationSpanCommand(spanID, begin, end)
        )
      } else {
        this.#commander.invoke(
          this.#commander.factory.removeSpanCommand(spanID)
        )
        if (nextSpan) {
          this.#selectionModel.selectSpan(nextSpan.id)
        }
      }
    }
  }

  #getExpandedSpanForTouchDevice() {
    const selectionWrapper = new SelectionWrapper(this.#spanModelContainer)

    // When there is no denotation span in ancestors of anchor node and focus node,
    // a span to expand does not exist.
    if (
      selectionWrapper.ancestorDenotationSpanOfAnchorNode == null &&
      selectionWrapper.ancestorDenotationSpanOfFocusNode == null
    ) {
      return null
    }

    // When you select text by mouse operation,
    // the anchor node of the selected string is always inside the span to be extended,
    // and the focus node is outside.
    if (
      selectionWrapper.parentOfFocusNode.contains(
        selectionWrapper.parentOfAnchorNode
      )
    ) {
      const spanID = selectionWrapper.ancestorDenotationSpanOfAnchorNode.id

      return {
        spanID,
        ...this.#spanModelContainer
          .get(spanID)
          .getExpandedInAnchorNodeToFocusNodeDirection(
            this.#menuState.spanAdjuster,
            selectionWrapper,
            this.#annotationModel.sourceDoc,
            this.#spanConfig
          )
      }
    }

    // On touch devices, the focus node of the selected string may be inside the span to be extended,
    // and the anchor node may be outside.
    if (
      selectionWrapper.parentOfAnchorNode.contains(
        selectionWrapper.parentOfFocusNode
      )
    ) {
      const spanID = selectionWrapper.ancestorDenotationSpanOfFocusNode.id

      return {
        spanID,
        ...this.#spanModelContainer
          .get(spanID)
          .getExpandedInFocusNodeToAnchorNodeDirection(
            this.#menuState.spanAdjuster,
            selectionWrapper,
            this.#annotationModel.sourceDoc,
            this.#spanConfig
          )
      }
    }
  }

  #getShrunkenSpanForTouchDevice() {
    const selectionWrapper = new SelectionWrapper(this.#spanModelContainer)

    // When there is no denotation span in ancestors of anchor node and focus node,
    // a span to shrink does not exist.
    if (
      selectionWrapper.ancestorDenotationSpanOfAnchorNode == null &&
      selectionWrapper.ancestorDenotationSpanOfFocusNode == null
    ) {
      return null
    }

    // On mobile devices,
    // do not shrink the denotation span when the selected text fits into one denotation span.
    if (
      selectionWrapper.parentOfAnchorNode === selectionWrapper.parentOfFocusNode
    ) {
      return null
    }

    // When you select text by mouse operation,
    // the anchor node of the selected string is always inside the span to be extended,
    // and the focus node is outside.
    if (
      selectionWrapper.parentOfFocusNode.contains(
        selectionWrapper.parentOfAnchorNode
      )
    ) {
      const spanID = selectionWrapper.ancestorDenotationSpanOfAnchorNode.id

      return {
        spanID,
        ...this.#spanModelContainer
          .get(spanID)
          .getShortenInFocusNodeToAnchorNodeDirection(
            this.#menuState.spanAdjuster,
            this.#annotationModel.sourceDoc,
            this.#annotationModel.span,
            this.#spanConfig
          )
      }
    }

    // On touch devices, the focus node of the selected string may be inside the span to be extended,
    // and the anchor node may be outside.
    if (
      selectionWrapper.parentOfAnchorNode.contains(
        selectionWrapper.parentOfFocusNode
      )
    ) {
      const spanID = selectionWrapper.ancestorDenotationSpanOfFocusNode.id

      return {
        spanID,
        ...this.#spanModelContainer
          .get(spanID)
          .getShortenInAnchorNodeToFocusNodeDirection(
            this.#menuState.spanAdjuster,
            this.#annotationModel.sourceDoc,
            this.#annotationModel.span,
            this.#spanConfig
          )
      }
    }
  }

  #anchorNodeInTextBoxFocusNodeInTextBox(selectionWrapper) {
    // The parent of the focusNode is the text.
    this.#create(selectionWrapper)
  }

  #anchorNodeInTextBoxFocusNodeInDenotationSpan(selectionWrapper) {
    const targetSpanID = this.#getShrinkableSpanID(selectionWrapper)
    if (targetSpanID) {
      this.#shrink(targetSpanID)
      return
    }

    clearTextSelection()
  }

  #anchorNodeInTextBoxFocusNodeInBlockSpan() {
    clearTextSelection()
  }

  #anchorNodeInTextBoxFocusNodeInStyleSpan(selectionWrapper) {
    // There is a Span between the StyleSpan and the text.
    // Shrink Span when mousedown on the text or a span and mouseup on the styleSpan.
    const targetSpanID = this.#getShrinkableSpanID(selectionWrapper)
    if (targetSpanID) {
      this.#shrink(targetSpanID)
      return
    }

    this.#create(selectionWrapper)
  }

  #anchorNodeInDenotationSpanFocusNodeInTextBox(selectionWrapper) {
    this.#expand(selectionWrapper, selectionWrapper.parentOfAnchorNode.id)
  }

  #anchorNodeInDenotationSpanFocusNodeInDenotationSpan(selectionWrapper) {
    const shrinkableEndSpanID = this.#getShrinkableEndSpanID(selectionWrapper)
    if (shrinkableEndSpanID) {
      this.#shrink(shrinkableEndSpanID)
      return
    }

    // The anchor node and the focus node are in the same span.
    if (selectionWrapper.isParentOfBothNodesSame) {
      this.#create(selectionWrapper)
      return
    }

    const shrinkTargetSpanID = this.#getShrinkableSpanID(selectionWrapper)
    if (shrinkTargetSpanID) {
      this.#shrink(shrinkTargetSpanID)
      return
    }

    // Mouse down on the child DenotationSpan
    // and mouse up on the sibling DenotationSpan of the parent DenotationSpan
    // to expand the the child DenotationSpan.
    // The condition for this is that the ancestor of the anchor node
    // and the ancestor of the focus node are the same.
    // Since this is always true, it will always expand when it is neither create nor shrink.
    this.#expand(selectionWrapper, selectionWrapper.parentOfAnchorNode.id)
  }

  #anchorNodeInDenotationSpanFocusNodeInBlockSpan(selectionWrapper) {
    if (
      selectionWrapper.parentOfFocusNode.contains(
        selectionWrapper.parentOfAnchorNode
      )
    ) {
      this.#expand(selectionWrapper, selectionWrapper.parentOfAnchorNode.id)
      return
    }

    clearTextSelection()
  }

  #anchorNodeInDenotationSpanFocusNodeInStyleSpan(selectionWrapper) {
    const shrinkTargetEndSpanID = this.#getShrinkableEndSpanID(selectionWrapper)
    if (shrinkTargetEndSpanID) {
      this.#shrink(shrinkTargetEndSpanID)
      return
    }

    if (
      selectionWrapper.parentOfAnchorNode ===
      selectionWrapper.ancestorDenotationSpanOfFocusNode
    ) {
      this.#create(selectionWrapper)
      return
    }

    const expandTargetSpanID = this.#getExpandableSpanID(selectionWrapper)
    if (expandTargetSpanID) {
      this.#expand(selectionWrapper, expandTargetSpanID)
      return
    }

    const shrinkTargetSpanID = this.#getShrinkableSpanID(selectionWrapper)
    if (shrinkTargetSpanID) {
      this.#shrink(shrinkTargetSpanID)
      return
    }
  }

  #anchorNodeInBlockSpanFocusNodeInTextBox() {
    clearTextSelection()
  }

  #anchorNodeInBlockSpanFocusNodeInDenotationSpan(selectionWrapper) {
    const shrinkTargetSpanID = this.#getShrinkableSpanID(selectionWrapper)
    if (shrinkTargetSpanID) {
      this.#shrink(shrinkTargetSpanID)
      return
    }

    clearTextSelection()
  }

  #anchorNodeInBlockSpanFocusNodeInBlockSpan(selectionWrapper) {
    this.#create(selectionWrapper)
  }

  #anchorNodeInBlockSpanFocusNodeInStyleSpan(selectionWrapper) {
    const shrinkTargetSpanID = this.#getShrinkableSpanID(selectionWrapper)
    if (shrinkTargetSpanID) {
      this.#shrink(shrinkTargetSpanID)
      return
    }

    clearTextSelection()
  }

  #anchorNodeInStyleSpanFocusNodeInTextBox(selectionWrapper) {
    // If the anchor node is a style span but has a parent span, extend the parent span.
    if (selectionWrapper.ancestorDenotationSpanOfAnchorNode) {
      const spanID = selectionWrapper.ancestorDenotationSpanOfAnchorNode.id

      if (spanID) {
        this.#expand(selectionWrapper, spanID)
      }
      return
    }

    this.#create(selectionWrapper)
  }

  #anchorNodeInStyleSpanFocusNodeInDenotationSpan(selectionWrapper) {
    const shrinkTargetEndSpanID = this.#getShrinkableEndSpanID(selectionWrapper)
    if (shrinkTargetEndSpanID) {
      this.#shrink(shrinkTargetEndSpanID)
      return
    }

    if (
      selectionWrapper.ancestorDenotationSpanOfAnchorNode ===
      selectionWrapper.parentOfFocusNode
    ) {
      this.#create(selectionWrapper)
      return
    }

    const shrinkTargetSpanID = this.#getShrinkableSpanID(selectionWrapper)
    if (shrinkTargetSpanID) {
      this.#shrink(shrinkTargetSpanID)
      return
    }

    const expandTargetSpanID = this.#getExpandableSpanID(selectionWrapper)
    if (expandTargetSpanID) {
      this.#expand(selectionWrapper, expandTargetSpanID)
      return
    }

    clearTextSelection()
  }

  #anchorNodeInStyleSpanFocusNodeInBlockSpan(selectionWrapper) {
    const expandTargetSpanID = this.#getExpandableSpanID(selectionWrapper)
    if (expandTargetSpanID) {
      this.#expand(selectionWrapper, expandTargetSpanID)
      return
    }

    this.#create(selectionWrapper)
  }

  #anchorNodeInStyleSpanFocusNodeInStyleSpan(selectionWrapper) {
    const shrinkTargetSpanID = this.#getShrinkableEndSpanID(selectionWrapper)
    if (shrinkTargetSpanID) {
      this.#shrink(shrinkTargetSpanID)
      return
    }

    if (
      selectionWrapper.isParentOfBothNodesSame ||
      selectionWrapper.isParentsParentOfAnchorNodeAndFocusedNodeSame
    ) {
      this.#create(selectionWrapper)
      return
    }

    const expandTargetSpanID = this.#getExpandableSpanID(selectionWrapper)
    if (expandTargetSpanID) {
      this.#expand(selectionWrapper, expandTargetSpanID)
      return
    }

    clearTextSelection()
  }

  #getShrinkableEndSpanID(selectionWrapper) {
    if (selectionWrapper.ancestorDenotationSpanOfAnchorNode) {
      const { anchor } = selectionWrapper.positionsOnAnnotation

      const { begin, end } = this.#spanModelContainer.getDenotationSpan(
        selectionWrapper.ancestorDenotationSpanOfAnchorNode.id
      )
      if (anchor === begin || anchor === end) {
        // Shrink the span of the ends.
        if (
          selectionWrapper.ancestorDenotationSpanOfAnchorNode ===
          selectionWrapper.ancestorDenotationSpanOfFocusNode
        ) {
          return selectionWrapper.ancestorDenotationSpanOfAnchorNode.id
        }

        // Shrink the parent of the parent-child span at the end.
        if (
          selectionWrapper.ancestorDenotationSpanOfAnchorNode !==
            selectionWrapper.ancestorDenotationSpanOfFocusNode &&
          selectionWrapper.ancestorDenotationSpanOfFocusNode.contains(
            selectionWrapper.ancestorDenotationSpanOfAnchorNode
          )
        ) {
          return selectionWrapper.ancestorDenotationSpanOfFocusNode.id
        }
      }
    }
  }

  #getShrinkableSpanID(selectionWrapper) {
    const targetSpanElement = selectionWrapper.ancestorDenotationSpanOfFocusNode

    if (targetSpanElement) {
      if (
        selectionWrapper.ancestorDenotationSpanOfAnchorNode !==
          targetSpanElement &&
        (!selectionWrapper.ancestorDenotationSpanOfAnchorNode ||
          selectionWrapper.ancestorDenotationSpanOfAnchorNode.contains(
            targetSpanElement
          ))
      ) {
        return targetSpanElement.id
      }
    }

    // If the parent of the anchor node is a descendant of the focus node,
    // and the focus node is selected, shrink the focus node.
    if (selectionWrapper.isAnchorNodeParentIsDescendantOfFocusNodeParent) {
      if (
        isPositionBetweenSpan(
          this.#selectionModel.span.single,
          selectionWrapper.positionsOnAnnotation.focus
        )
      ) {
        return this.#selectionModel.span.single.element.id
      }
    }
  }

  #getExpandableSpanID(selectionWrapper) {
    const targetSpanElement =
      selectionWrapper.ancestorDenotationSpanOfAnchorNode

    if (targetSpanElement) {
      const { ancestorDenotationSpanOfFocusNode } = selectionWrapper

      if (ancestorDenotationSpanOfFocusNode) {
        if (
          targetSpanElement !== ancestorDenotationSpanOfFocusNode &&
          (targetSpanElement.parentElement ===
            ancestorDenotationSpanOfFocusNode.parentElement ||
            ancestorDenotationSpanOfFocusNode.contains(targetSpanElement))
        ) {
          return targetSpanElement.id
        }
      } else {
        return targetSpanElement.id
      }
    }
  }

  #create(selectionWrapper) {
    if (
      hasCharacters(
        this.#annotationModel.sourceDoc,
        this.#spanConfig,
        selectionWrapper.positionsOnAnnotation
      )
    ) {
      this.#selectionModel.removeAll()
      create(
        this.#annotationModel.sourceDoc,
        this.#spanModelContainer,
        this.#commander,
        this.#menuState.spanAdjuster,
        this.#isReplicateAuto,
        selectionWrapper,
        this.#spanConfig,
        getIsDelimiterFunc(this.#menuState, this.#spanConfig)
      )
    }
    clearTextSelection()
  }

  #expand(selectionWrapper, spanID) {
    this.#selectionModel.removeAll()

    const { begin, end } = this.#spanModelContainer
      .get(spanID)
      .getExpandedInAnchorNodeToFocusNodeDirection(
        this.#menuState.spanAdjuster,
        selectionWrapper,
        this.#annotationModel.sourceDoc,
        this.#spanConfig
      )

    if (validateNewDenotationSpan(this.#spanModelContainer, begin, end)) {
      this.#commander.invoke(
        this.#commander.factory.moveDenotationSpanCommand(spanID, begin, end)
      )
    }

    clearTextSelection()
  }

  #shrink(spanID) {
    shrinkSpan(
      this.#editorHTMLElement,
      this.#spanModelContainer,
      this.#annotationModel.sourceDoc,
      this.#selectionModel,
      this.#commander,
      this.#menuState.spanAdjuster,
      spanID,
      this.#spanConfig,
      (begin, end) => {
        this.#commander.invoke(
          this.#commander.factory.moveDenotationSpanCommand(spanID, begin, end)
        )
      }
    )

    clearTextSelection()
  }

  get #isReplicateAuto() {
    return this.#menuState.isPushed('auto replicate')
  }
}
