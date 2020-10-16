import clearTextSelection from '../../../clearTextSelection'
import Positions from './Positions'
import DelimiterDetectAdjuster from './DelimiterDetectAdjuster'
import BlankSkipAdjuster from './BlankSkipAdjuster'
import create from './create'
import crossTheEar from './crossTheEar'
import pullByTheEar from './pullByTheEar'
import selectSpan from './selectSpan'
import SelectionWrapper from './SelectionWrapper'
import getExpandTargetSpan from './getExpandTargetSpan'
import expand from './expand'
import hasCharacters from './hasCharacters'
import getTargetSpanWhenFocusNodeDifferentFromAnchorNode from './getTargetSpanWhenFocusNodeDifferentFromAnchorNode'
import getIsDelimiterFunc from '../../../../getIsDelimiterFunc'

export default class {
  constructor(
    editor,
    annotationData,
    selectionModel,
    commander,
    buttonController,
    spanConfig
  ) {
    this._editor = editor
    this._annotationData = annotationData
    this._selectionModel = selectionModel
    this._commander = commander
    this._buttonController = buttonController
    this._spanConfig = spanConfig
  }

  textBoxClicked(event) {
    const selection = window.getSelection()

    if (selection.type === 'Range') {
      this._selectEndOnText()
      event.stopPropagation()
    } else {
      this._selectionModel.clear()
    }
  }

  spanClicked(event) {
    // When you click on the text, the browser will automatically select the word.
    // Therefore, the editor shrinks spans instead of selecting spans.
    // Deselect the text.
    if (event.button === 2) {
      clearTextSelection()
    }

    const selection = window.getSelection()

    if (selection.type === 'Caret') {
      this._selectSpan(event, event.target.id)
    }

    if (selection.type === 'Range') {
      this._selectEndOnSpan()
    }
  }

  styleSpanClicked(e) {
    // When you click on the text, the browser will automatically select the word.
    // Therefore, the editor shrinks spans instead of selecting spans.
    // Deselect the text.
    if (e.button === 2) {
      clearTextSelection()
    }

    const selection = window.getSelection()

    if (selection.type === 'Caret') {
      const span = e.target.closest('.textae-editor__span')
      if (span) {
        this._selectSpan(e, span.id)
      }
    }

    if (selection.type === 'Range') {
      this._selectEndOnStyleSpan()
    }
  }

  _selectSpan(event, spanId) {
    selectSpan(this._annotationData, this._selectionModel, event, spanId)
  }

  _selectEndOnText() {
    const selectionWrapper = new SelectionWrapper()

    const isValid =
      selectionWrapper.isFocusNodeInTextBox &&
      (selectionWrapper.isAnchorNodeInTextBox ||
        selectionWrapper.isAnchorNodeInSpan ||
        selectionWrapper.isAnchorNodeInStyleSpan) &&
      this._hasCharacters(selectionWrapper)

    if (isValid) {
      if (
        selectionWrapper.isAnchorNodeInStyleSpanAndTheStyleSpanIsDescendantOfSpan
      ) {
        // If the anchor node is a style span but has a parent span, extend the parent span.
        const span = selectionWrapper.ancestorSpanOfAnchorNode
        this._expandOnStyleSpan(selectionWrapper, span)
        return
      }

      // The parent of the focusNode is the text.
      if (
        selectionWrapper.isAnchorNodeInTextBox ||
        selectionWrapper.isAnchorNodeInStyleSpan
      ) {
        this._create(selectionWrapper)
        return
      }

      if (selectionWrapper.isAnchorNodeInSpan) {
        this._expand(selectionWrapper)
        return
      }
    }

    clearTextSelection()
  }

  _selectEndOnSpan() {
    const selectionWrapper = new SelectionWrapper()
    const isValid =
      selectionWrapper.isFocusNodeInSpan &&
      (selectionWrapper.isAnchorNodeInTextBox ||
        selectionWrapper.isAnchorNodeInSpan ||
        selectionWrapper.isAnchorNodeInStyleSpan) &&
      hasCharacters(this._annotationData, this._spanConfig, selectionWrapper)

    if (isValid) {
      if (selectionWrapper.isParentOfAnchorNodeAndFocusedNodeSame) {
        const positions = new Positions(this._annotationData, selectionWrapper)
        const span = this._getAnchorNodeParentSpan(selectionWrapper)
        if (positions.anchor === span.begin || positions.anchor === span.end) {
          this._shrinkPullByTheEar(selectionWrapper)
        } else {
          this._create(selectionWrapper)
        }
        return
      }

      if (selectionWrapper.isFocusNodeParentIsDescendantOfAnchorNodeParent) {
        this._shrinkCrossTheEar(selectionWrapper)
        return
      }

      if (
        selectionWrapper.isAnchorNodeInSpan &&
        selectionWrapper.isAnchorNodeParentIsDescendantOfFocusNodeParent
      ) {
        // If you select the parent span on the left edge of the screen and shrink it from the left,
        // the anchorNode is the child span and the focusNode is the parent span.
        // If the focusNode (parent span) is selected, shrink the parent span.
        if (selectionWrapper.isFocusNodeParentSelected) {
          this._shrinkCrossTheEar(selectionWrapper)
        } else {
          this._expand(selectionWrapper)
        }

        return
      }

      if (
        selectionWrapper.isAnchorNodeInSpan &&
        selectionWrapper.isFocusNodeParentIsDescendantOfAnchorNodeParentOfParent
      ) {
        // When extending the span to the right,
        // if the right edge after stretching is the same as the right edge of the second span,
        // the anchorNode will be the textNode of the first span and the focusNode will be the textNode of the second span.
        // If the Span of the focusNode belongs to the parent of the Span of the anchorNode, the first Span is extensible.
        // The same applies when extending to the left.
        this._expand(selectionWrapper)
      }
    }

    clearTextSelection()
  }

  _selectEndOnStyleSpan() {
    const selectionWrapper = new SelectionWrapper()
    const isValid =
      selectionWrapper.isFocusNodeInStyleSpan &&
      (selectionWrapper.isAnchorNodeInTextBox ||
        selectionWrapper.isAnchorNodeInSpan ||
        selectionWrapper.isAnchorNodeInStyleSpan) &&
      hasCharacters(this._annotationData, this._spanConfig, selectionWrapper)

    if (isValid) {
      if (selectionWrapper.isParentOfAnchorNodeAndFocusedNodeSame) {
        this._create(selectionWrapper)
        return
      }

      if (selectionWrapper.isAnchorNodeInSpan) {
        // Mousedown on the child Span of a parent and child Span,
        // and then mouseup on the StyleSpan in the parent Span.
        if (selectionWrapper.isParentsParentOfAnchorNodeAndFocusedNodeSame) {
          this._expandOnStyleSpan(
            selectionWrapper,
            selectionWrapper.parentOfAnchorNode
          )
          return
        }

        // There is a Span between the StyleSpan and the text.
        // Shrink Span when mousedown on the text or a span and mouseup on the styleSpan.
        if (selectionWrapper.ancestorSpanOfFocusNode) {
          this._shrinkCrossTheEarOnStyleSpan(selectionWrapper)
          return
        }
      }

      if (selectionWrapper.isAnchorNodeInTextBox) {
        // There is a Span between the StyleSpan and the text.
        // Shrink Span when mousedown on the text or a span and mouseup on the styleSpan.
        if (selectionWrapper.ancestorSpanOfFocusNode) {
          this._shrinkCrossTheEarOnStyleSpan(selectionWrapper)
          return
        }

        this._create(selectionWrapper)
        return
      }

      if (selectionWrapper.isAnchorNodeParentIsDescendantOfFocusNodeParent) {
        this._expand(selectionWrapper)
        return
      }
    }

    clearTextSelection()
  }

  _hasCharacters(selectionWrapper) {
    return hasCharacters(
      this._annotationData,
      this._spanConfig,
      selectionWrapper
    )
  }

  _getPosition(selectionWrapper) {
    return new Positions(this._annotationData, selectionWrapper)
  }

  _getAnchorNodeParentSpan(selectionWrapper) {
    return this._annotationData.span.get(selectionWrapper.parentOfAnchorNode.id)
  }

  _create(selectionWrapper) {
    this._selectionModel.clear()
    create(
      this._annotationData,
      this._commander,
      this._spanAdjuster,
      this._isReplicateAuto,
      selectionWrapper,
      this._spanConfig,
      getIsDelimiterFunc(this._buttonController, this._spanConfig)
    )
  }

  _expand(selectionWrapper) {
    const spanId = getExpandTargetSpan(this._selectionModel, selectionWrapper)

    if (spanId) {
      expand(
        this._selectionModel,
        this._annotationData,
        this._commander,
        this._spanAdjuster,
        spanId,
        selectionWrapper,
        this._spanConfig
      )
    }

    clearTextSelection()
  }

  _expandOnStyleSpan(selectionWrapper, span) {
    const spanId = span.id

    if (spanId) {
      expand(
        this._selectionModel,
        this._annotationData,
        this._commander,
        this._spanAdjuster,
        spanId,
        selectionWrapper,
        this._spanConfig
      )
    }

    clearTextSelection()
  }

  _shrinkCrossTheEar(selectionWrapper) {
    const spanId = getTargetSpanWhenFocusNodeDifferentFromAnchorNode(
      this._annotationData,
      this._selectionModel,
      selectionWrapper
    )

    crossTheEar(
      this._editor,
      this._annotationData,
      this._selectionModel,
      this._commander,
      this._spanAdjuster,
      spanId,
      selectionWrapper,
      this._spanConfig
    )

    clearTextSelection()
  }

  _shrinkCrossTheEarOnStyleSpan(selectionWrapper) {
    const spanId = selectionWrapper.ancestorSpanOfFocusNode.id

    crossTheEar(
      this._editor,
      this._annotationData,
      this._selectionModel,
      this._commander,
      this._spanAdjuster,
      spanId,
      selectionWrapper,
      this._spanConfig
    )

    clearTextSelection()
  }

  _shrinkPullByTheEar(selectionWrapper) {
    pullByTheEar(
      this._editor,
      this._annotationData,
      this._selectionModel,
      this._commander,
      this._spanAdjuster,
      selectionWrapper,
      this._spanConfig
    )

    clearTextSelection()
  }

  get _isReplicateAuto() {
    return this._buttonController.valueOf('replicate-auto')
  }

  get _spanAdjuster() {
    return this._buttonController.valueOf('boundary-detection')
      ? new DelimiterDetectAdjuster()
      : new BlankSkipAdjuster()
  }
}
