import alertifyjs from 'alertifyjs'
import updateSpanTree from './updateSpanTree'
import spanComparator from './spanComparator'
import {
  makeBlockSpanHTMLElementID,
  makeDenotationSpanHTMLElementID
} from '../../idFactory'
import DenotationSpanInstance from './DenotationSpanInstance'
import StyleSpanInstance from './StyleSpanInstance'
import BlockSpanInstance from './BlockSpanInstance'
import isBoundaryCrossingWithOtherSpans from '../isBoundaryCrossingWithOtherSpans'
import rangeFrom from './rangeFrom'
import getCurrentMaxHeight from './getCurrentMaxHeight'
import TextSelection from './TextSelection'

export default class SpanInstanceContainer {
  #editorID
  #editorHTMLElement
  #emitter
  #textBox
  #denotations
  #blocks
  #styles

  /**
   *
   * @param {import('../createTextBox/TextBox').default} textBox
   */
  constructor(editorID, editorHTMLElement, emitter, textBox) {
    this.#editorID = editorID
    this.#editorHTMLElement = editorHTMLElement
    this.#emitter = emitter
    this.#textBox = textBox

    this.#denotations = new Map()
    this.#blocks = new Map()
    this.#styles = new Map()
  }

  // expected span is like { "begin": 19, "end": 49 }
  add(newValue) {
    console.assert(newValue, 'span is necessary.')

    // When redoing, the newValue is instance of the BlockSpanInstance
    // or the DenotationSpan already.
    if (newValue instanceof BlockSpanInstance) {
      return this.#addBlock(newValue)
    } else if (newValue instanceof DenotationSpanInstance) {
      return this.#addDenotation(newValue)
    } else if (newValue.isBlock) {
      console.assert(
        !this.#doesParentOrSameSpanExist(newValue.begin, newValue.end),
        `There are some parent spans of {begin: ${newValue.begin}, end: ${newValue.end}}.`
      )

      const blockSpan = new BlockSpanInstance(
        this.#editorID,
        this.#editorHTMLElement,
        newValue.begin,
        newValue.end,
        this,
        this.#textBox
      )
      return this.#addBlock(blockSpan)
    } else {
      console.assert(
        !this.hasDenotationSpan(newValue.begin, newValue.end),
        'There is already a span.'
      )
      const denotationSpan = new DenotationSpanInstance(
        this.#editorID,
        this.#editorHTMLElement,
        newValue.begin,
        newValue.end,
        this
      )
      return this.#addDenotation(denotationSpan)
    }
  }

  // Does not draw the instance.
  // When loading for the first time, all instances will be loaded at once.
  // The drawing of the instance is performed at a different time.
  addSource(rowData, type) {
    for (const rowDatum of rowData) {
      this.#addInstanceFromRowDatum(type, rowDatum)
    }

    this.#updateSpanTree()
  }

  hasDenotationSpan(begin, end) {
    const spanID = makeDenotationSpanHTMLElementID(this.#editorID, begin, end)
    return this.#denotations.has(spanID)
  }

  validateNewDenotationSpan(begin, end) {
    // The span cross exists spans.
    if (this.isBoundaryCrossingWithOtherSpans(begin, end)) {
      alertifyjs.warning(
        'A span cannot be modified to make a boundary crossing.'
      )
      return false
    }

    // The span exists already.
    if (this.hasDenotationSpan(begin, end)) {
      return false
    }

    // There is a BlockSpan that is a child.
    if (this.#hasBlockSpanBetween(begin, end)) {
      return false
    }

    return true
  }

  hasBlockSpan(begin, end) {
    const spanID = makeBlockSpanHTMLElementID(this.#editorID, begin, end)
    return this.#blocks.has(spanID)
  }

  validateNewBlockSpan(begin, end, spanID) {
    // The span cross exists spans.
    if (this.isBoundaryCrossingWithOtherSpans(begin, end)) {
      alertifyjs.warning(
        'A span cannot be modified to make a boundary crossing.'
      )
      return false
    }

    if (this.#doesParentOrSameSpanExist(begin, end)) {
      return false
    }

    // There is a BlockSpan that is a child.
    if (
      this.#hasBlockSpanBetween(begin, end, {
        excluded: spanID
      })
    ) {
      return false
    }

    return true
  }

  hasParentOf(begin, end, spanID) {
    for (const parent of this.all) {
      if (parent.id === spanID) {
        continue
      }

      if (parent.begin <= begin && end <= parent.end) {
        return true
      }
    }

    return false
  }

  /**
   *
   * @returns {import('./SpanInstance').SpanInstance}
   */
  get(spanID) {
    if (this.#denotations.has(spanID)) {
      return this.#denotations.get(spanID)
    } else if (this.#blocks.has(spanID)) {
      return this.#blocks.get(spanID)
    } else {
      // Returns a typesetting only.
      return this.#styles.get(spanID)
    }
  }

  getStyle(spanID) {
    if (this.#styles.has(spanID)) {
      return this.#styles.get(spanID).styles
    } else {
      return new Set()
    }
  }

  getDenotationSpan(spanID) {
    if (this.#denotations.has(spanID)) {
      return this.#denotations.get(spanID)
    }
  }

  rangeDenotationSpan(firstID, secondID) {
    return rangeFrom(this.#denotations, firstID, secondID)
  }

  rangeBlockSpan(firstID, secondID) {
    return rangeFrom(this.#blocks, firstID, secondID)
  }

  get topLevel() {
    return this.all.filter((span) => span.parent === this).sort(spanComparator)
  }

  get children() {
    return this.topLevel
  }

  clear() {
    this.#denotations.clear()
    this.#blocks.clear()
    this.#styles.clear()
  }

  remove(id) {
    const blockSpan = this.#blocks.get(id)
    if (blockSpan) {
      this.#removeBlock(blockSpan)
      this.#emitter.emit(`textae-event.annotation-data.span.remove`, blockSpan)
      return
    }

    const denotationSpan = this.#denotations.get(id)
    if (denotationSpan) {
      this.#removeDenotation(denotationSpan)
      this.#emitter.emit(
        `textae-event.annotation-data.span.remove`,
        denotationSpan
      )
      return
    }

    console.assert(false, `There is no target for remove for ${id}!`)
  }

  // Since moving a span is deleting and adding span tags,
  // we will delete and add the instance as well.
  moveDenotationSpan(id, begin, end) {
    console.assert(
      id !== makeDenotationSpanHTMLElementID(this.#editorID, begin, end),
      `Do not need move span:  ${id} ${begin} ${end}`
    )

    const oldSpan = this.#denotations.get(id)
    console.assert(oldSpan, `There is no target for move for ${id}!`)

    this.#removeDenotation(oldSpan)

    const newOne = new DenotationSpanInstance(
      this.#editorID,
      this.#editorHTMLElement,
      begin,
      end,
      this
    )
    this.#addDenotation(newOne, oldSpan)
    this.#emitter.emit('textae-event.annotation-data.span.move')

    return {
      begin: oldSpan.begin,
      end: oldSpan.end,
      id: newOne.id
    }
  }

  moveBlockSpan(id, begin, end) {
    console.assert(
      id !== makeBlockSpanHTMLElementID(this.#editorID, begin, end),
      `Do not need move span:  ${id} ${begin} ${end}`
    )

    const oldSpan = this.#blocks.get(id)
    this.#removeBlock(oldSpan)

    const newOne = new BlockSpanInstance(
      this.#editorID,
      this.#editorHTMLElement,
      begin,
      end,
      this,
      this.#textBox
    )
    this.#addBlock(newOne, oldSpan)
    this.#emitter.emit('textae-event.annotation-data.span.move')

    return {
      begin: oldSpan.begin,
      end: oldSpan.end,
      id: newOne.id
    }
  }

  isBoundaryCrossingWithOtherSpans(begin, end) {
    return isBoundaryCrossingWithOtherSpans(this.all, begin, end)
  }

  get all() {
    const styleOnlySpans = [...this.#styles.values()].filter(
      (s) => !this.#denotations.has(s.id)
    )
    return [...this.#blocks.values()]
      .concat([...this.#denotations.values()])
      .concat(styleOnlySpans)
  }

  get selectedItems() {
    return [...this.#blocks.values()]
      .concat([...this.#denotations.values()])
      .filter(({ isSelected }) => isSelected)
  }

  /**
   * @returns {import('./DenotationSpanInstance').DenotationSpanInstance[]}
   */
  get allDenotationSpans() {
    return [...this.#denotations.values()]
  }

  get allBlockSpans() {
    return [...this.#blocks.values()]
  }

  // It has a common interface with the span instance so that it can be the parent of the span instance.
  get begin() {
    return 0
  }

  // It has a common interface with the span instance so that it can be the parent of the span instance
  get element() {
    return this.#editorHTMLElement.querySelector(`.textae-editor__text-box`)
  }

  get textSelection() {
    return new TextSelection(this)
  }

  arrangeDenotationEntityPosition() {
    for (const span of this.allDenotationSpans) {
      span.updateGridPosition()
    }
  }

  arrangeBlockEntityPosition() {
    for (const span of this.allBlockSpans) {
      span.updateGridPosition()
    }
  }

  arrangeBackgroundOfBlockSpanPosition() {
    for (const span of this.allBlockSpans) {
      span.updateBackgroundPosition()
    }
  }

  get maxHeight() {
    const spans = [...this.#blocks.values()].concat([
      ...this.#denotations.values()
    ])

    if (spans.length) {
      return getCurrentMaxHeight(spans)
    } else {
      return null
    }
  }

  #hasBlockSpanBetween(begin, end, option = {}) {
    for (const blockSpan of this.#blocks.values()) {
      if (
        begin <= blockSpan.begin &&
        blockSpan.end <= end &&
        option &&
        blockSpan.id !== option.excluded
      ) {
        return true
      }
    }

    return false
  }

  #doesParentOrSameSpanExist(begin, end) {
    const isParent = (span) => span.begin <= begin && end <= span.end

    return (
      [...this.#denotations.values()].some(isParent) ||
      [...this.#blocks.values()].some(isParent) ||
      [...this.#styles.values()].some(isParent)
    )
  }

  #addDenotation(denotationSpan, oldSpan = null) {
    this.#addSpan(this.#denotations, denotationSpan, oldSpan)
    this.#emitter.emit(`textae-event.annotation-data.span.add`, denotationSpan)

    return denotationSpan
  }

  #addBlock(blockSpan, oldSpan = null) {
    this.#addSpan(this.#blocks, blockSpan, oldSpan)
    this.#emitter.emit(`textae-event.annotation-data.span.add`, blockSpan)

    return blockSpan
  }

  #addSpan(container, span, oldSpan = null) {
    container.set(span.id, span)
    this.#updateSpanTree()

    if (oldSpan) {
      // Span.entities depends on the property of the entity.
      // Span DOM element is rendered by 'span.add' event.
      // We need to update the span ID of the entity before 'span.add' event.
      oldSpan.passesAllEntitiesTo(span)
    }

    span.render()

    const { clientHeight, clientWidth } = document.documentElement
    span.drawGrid(clientHeight, clientWidth)
  }

  #removeDenotation(span) {
    this.#denotations.delete(span.id)
    span.erase()
    // When changing the length of a span, the span is erased and rendered again.
    // When the span is erased, the span erase event fires and the position calculations for all annotations are performed.
    // The event is not fired in this function.
  }

  #removeBlock(span) {
    this.#blocks.delete(span.id)
    span.erase()
    // When changing the length of a span, the span is erased and rendered again.
    // When the span is erased, the span erase event fires and the position calculations for all annotations are performed.
    // The event is not fired in this function.
  }

  #updateSpanTree() {
    // Register a typesetting in the span tree to put it in the span rendering flow.
    updateSpanTree(this, this.all)
  }

  #addInstanceFromRowDatum(spanType, rowDatum) {
    switch (spanType) {
      case 'denotation': {
        const objectSpan = new DenotationSpanInstance(
          this.#editorID,
          this.#editorHTMLElement,
          rowDatum.span.begin,
          rowDatum.span.end,
          this
        )

        if (!this.#denotations.has(objectSpan.id)) {
          this.#denotations.set(objectSpan.id, objectSpan)
        }
        break
      }
      case 'block': {
        const blockSpan = new BlockSpanInstance(
          this.#editorID,
          this.#editorHTMLElement,
          rowDatum.span.begin,
          rowDatum.span.end,
          this,
          this.#textBox
        )

        if (!this.#blocks.has(blockSpan.id)) {
          this.#blocks.set(blockSpan.id, blockSpan)
        }
        break
      }
      case 'typesetting': {
        const styleSpan = new StyleSpanInstance(
          this.#editorID,
          this.#editorHTMLElement,
          rowDatum.span.begin,
          rowDatum.span.end,
          this,
          rowDatum.style
        )

        // Merge multiple styles for the same range.
        if (this.#styles.has(styleSpan.id)) {
          this.#styles.get(styleSpan.id).appendStyles(styleSpan.styles)
        } else {
          this.#styles.set(styleSpan.id, styleSpan)
        }

        break
      }
      default:
        throw `${spanType} is unknown type span!`
    }
  }
}
