import clearTextSelection from '../../../../clearTextSelection'
import Positions from './Positions'
import DelimiterDetectAdjuster from './DelimiterDetectAdjuster'
import BlankSkipAdjuster from './BlankSkipAdjuster'
import create from './create'
import shrink from './shrink'
import getExpandTargetSpan from './getExpandTargetSpan'
import expand from './expand'
import hasCharacters from './hasCharacters'
import getIsDelimiterFunc from '../../../../../getIsDelimiterFunc'

export default class SpanEditor {
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

  editFor(selectionWrapper) {
    if (selectionWrapper.isParentOfAnchorNodeTextBox) {
      if (selectionWrapper.isParentOfFocusNodeTextBox) {
        this._anchorNodeInTextBoxFocusNodeInTextBox(selectionWrapper)
      } else if (selectionWrapper.isParentOfFocusNodeSpan) {
        this._anchorNodeInTextBoxFocusNodeInSpan(selectionWrapper)
      } else if (selectionWrapper.isParentOfFocusNodeStyleSpan) {
        this._anchorNodeInTextBoxFocusNodeInStyleSpan(selectionWrapper)
      }
    } else if (selectionWrapper.isParentOfAnchorNodeSpan) {
      if (selectionWrapper.isParentOfFocusNodeTextBox) {
        this._anchorNodeInSpanFocusNodeInTextBox(selectionWrapper)
      } else if (selectionWrapper.isParentOfFocusNodeSpan) {
        this._anchorNodeInSpanFocusNodeInSpan(selectionWrapper)
      } else if (selectionWrapper.isParentOfFocusNodeStyleSpan) {
        this._anchorNodeInSpanFocusNodeInStyleSpan(selectionWrapper)
      }
    } else if (selectionWrapper.isParentOfAnchorNodeStyleSpan) {
      if (selectionWrapper.isParentOfFocusNodeTextBox) {
        this._anchorNodeInStyleSpanFocusNodeInTextBox(selectionWrapper)
      } else if (selectionWrapper.isParentOfFocusNodeSpan) {
        this._anchorNodeInStyleSpanFocusNodeInSpan(selectionWrapper)
      } else if (selectionWrapper.isParentOfFocusNodeStyleSpan) {
        this._anchorNodeInStyleSpanFocusNodeInStyleSpan(selectionWrapper)
      }
    }
  }

  _anchorNodeInTextBoxFocusNodeInTextBox(selectionWrapper) {
    // The parent of the focusNode is the text.
    this._create(selectionWrapper)
  }

  _anchorNodeInTextBoxFocusNodeInSpan(selectionWrapper) {
    this._shrinkSelectSpanOrOneUpFocusParentSpan(selectionWrapper)
  }

  _anchorNodeInTextBoxFocusNodeInStyleSpan(selectionWrapper) {
    // There is a Span between the StyleSpan and the text.
    // Shrink Span when mousedown on the text or a span and mouseup on the styleSpan.
    if (selectionWrapper.ancestorSpanOfFocusNode) {
      const spanId = selectionWrapper.ancestorSpanOfFocusNode.id
      this._shrink(selectionWrapper, spanId)
      return
    }

    this._create(selectionWrapper)
  }

  _anchorNodeInSpanFocusNodeInTextBox(selectionWrapper) {
    const spanId = getExpandTargetSpan(this._selectionModel, selectionWrapper)
    this._expand(selectionWrapper, spanId)
  }

  _anchorNodeInSpanFocusNodeInSpan(selectionWrapper) {
    // The anchor node and the focus node are in the same span.
    if (selectionWrapper.isParentOfAnchorNodeAndFocusedNodeSame) {
      const parentSpan = this._annotationData.span.get(
        selectionWrapper.parentOfAnchorNode.id
      )
      const positions = new Positions(this._annotationData, selectionWrapper)
      if (
        positions.anchor === parentSpan.begin ||
        positions.anchor === parentSpan.end
      ) {
        // The start or end of the selected region is at the same position
        // as the start or end of the parent span.
        // Shrink the span at the front or back end of the text.
        if (this._isFocusInSelectedSpan(selectionWrapper)) {
          this._shrinkSelectedSpan(selectionWrapper)
        } else {
          this._shrink(selectionWrapper, parentSpan.id)
        }
      } else {
        this._create(selectionWrapper)
      }
      return
    }

    // The anchor node is in the parent span and the focus node is in the child span.
    if (
      selectionWrapper.parentOfFocusNode.closest(
        `#${selectionWrapper.parentOfAnchorNode.id}`
      )
    ) {
      this._shrinkSelectSpanOrOneUpFocusParentSpan(selectionWrapper)
      return
    }

    // The anchor node is in the child span and the focus node is in the parent span.
    if (
      selectionWrapper.parentOfAnchorNode.closest(
        `#${selectionWrapper.parentOfFocusNode.id}`
      )
    ) {
      if (this._isFocusInSelectedSpan(selectionWrapper)) {
        this._shrinkSelectedSpan(selectionWrapper)
      } else {
        const spanId = getExpandTargetSpan(
          this._selectionModel,
          selectionWrapper
        )

        this._expand(selectionWrapper, spanId)
      }

      return
    }

    // When you mouse down in one span and mouse up in another span
    clearTextSelection()
  }

  _anchorNodeInSpanFocusNodeInStyleSpan(selectionWrapper) {
    // Mousedown on the child Span of a parent and child Span,
    // and then mouseup on the StyleSpan in the parent Span.
    if (selectionWrapper.isParentsParentOfAnchorNodeAndFocusedNodeSame) {
      const spanId = selectionWrapper.parentOfAnchorNode.id

      this._expand(selectionWrapper, spanId)
      return
    }

    // There is a Span between the StyleSpan and the text.
    // Shrink Span when mousedown on the text or a span and mouseup on the styleSpan.
    if (selectionWrapper.ancestorSpanOfFocusNode) {
      const spanId = selectionWrapper.ancestorSpanOfFocusNode.id

      this._shrink(selectionWrapper, spanId)
      return
    }
  }

  _anchorNodeInStyleSpanFocusNodeInTextBox(selectionWrapper) {
    // If the anchor node is a style span but has a parent span, extend the parent span.
    if (selectionWrapper.ancestorSpanOfAnchorNode) {
      const spanId = selectionWrapper.ancestorSpanOfAnchorNode.id
      this._expand(selectionWrapper, spanId)
      return
    }

    this._create(selectionWrapper)
  }

  _anchorNodeInStyleSpanFocusNodeInSpan(selectionWrapper) {
    if (this._isFocusInSelectedSpan(selectionWrapper)) {
      this._shrinkSelectedSpan(selectionWrapper)
      return
    }

    // When an anchor node has an ancestral span and the focus node is its sibling,
    // expand the ancestral span.
    if (
      selectionWrapper.ancestorSpanOfAnchorNode &&
      selectionWrapper.ancestorSpanOfAnchorNode.parentElement ===
        selectionWrapper.parentOfFocusNode
    ) {
      const spanId = selectionWrapper.ancestorSpanOfAnchorNode.id
      this._expand(selectionWrapper, spanId)
      return
    }

    // When you mouse down on a parent style span and mouse up on the child span,
    // you shrink the child span.
    if (selectionWrapper.isFocusOneDownUnderAnchor) {
      this._shrink(selectionWrapper, selectionWrapper.parentOfFocusNode.id)
      return
    }

    // When you mouse down on a child style span and mouse up on the parent span,
    // you shrink the parent span.
    if (selectionWrapper.isAnchorOneDownUnderFocus) {
      this._shrink(selectionWrapper, selectionWrapper.parentOfFocusNode.id)
      return
    }

    clearTextSelection()
  }

  _anchorNodeInStyleSpanFocusNodeInStyleSpan(selectionWrapper) {
    if (
      selectionWrapper.isParentOfAnchorNodeAndFocusedNodeSame ||
      selectionWrapper.isParentsParentOfAnchorNodeAndFocusedNodeSame
    ) {
      this._create(selectionWrapper)
    }

    clearTextSelection()
  }

  _isFocusInSelectedSpan(selectionWrapper) {
    const span = this._selectionModel.span.single

    if (!span) {
      return false
    }

    const position = new Positions(this._annotationData, selectionWrapper).focus
    return span.begin < position && position < span.end
  }

  _create(selectionWrapper) {
    if (
      hasCharacters(this._annotationData, this._spanConfig, selectionWrapper)
    ) {
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
    clearTextSelection()
  }

  _expand(selectionWrapper, spanId) {
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

  _shrinkSelectSpanOrOneUpFocusParentSpan(selectionWrapper) {
    if (this._isFocusInSelectedSpan(selectionWrapper)) {
      // If a span is selected, it is able to begin drag out of an outer span of the span and shrink the span.
      // The focus node should be at the selected node.
      // cf.
      // 1. Select an inner span.
      // 2. Begin Drug from out of an outside span to the selected span.
      // Shrink the selected span.
      this._shrinkSelectedSpan(selectionWrapper)
    } else if (selectionWrapper.isFocusOneDownUnderAnchor) {
      // To shrink the span , belows are needed:
      // 1. The anchorNode out of the span and in the parent of the span.
      // 2. The foucusNode is in the span.
      this._shrink(selectionWrapper, selectionWrapper.parentOfFocusNode.id)
    }
  }

  _shrinkSelectedSpan(selectionWrapper) {
    this._shrink(selectionWrapper, this._selectionModel.span.singleId)
  }

  _shrink(selectionWrapper, spanId) {
    shrink(
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

  get _isReplicateAuto() {
    return this._buttonController.valueOf('replicate-auto')
  }

  get _spanAdjuster() {
    return this._buttonController.valueOf('boundary-detection')
      ? new DelimiterDetectAdjuster()
      : new BlankSkipAdjuster()
  }
}
