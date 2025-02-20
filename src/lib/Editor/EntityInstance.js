import TypeValues from '../TypeValues.js'
import SignboardHTMLElement from './SignboardHTMLElement.js'
import getDisplayName from './getDisplayName/index.js'
import getURI from './getURI.js'
import toAnchorElement from './toAnchorElement.js'
import round from './round.js'

const DistanceToShift = 8
// Leave a gap half the width of the triangle so that the triangle does not intersect the vertical line.
const MinimumDistance = DistanceToShift * 3 + 4

export default class EntityInstance {
  #editorID
  #id
  #attributeInstanceContainer
  #relationInstanceContainer
  #namespaceInstanceContainer
  #typeGap
  #typeDictionary
  #toolBarHeight
  #isSelected = false
  #isHovered = false
  // When in view mode, the mouseleave event will not declarify labels.
  #isLabelClarified = false
  /** @type {SignboardHTMLElement} */
  #signboard = null
  #span
  #typeName

  /**
   *
   * @param {import('./AnnotationModel/SpanInstanceContainer/SpanInstance/index.js').SpanInstance} span
   */
  constructor(
    editorID,
    attributeInstanceContainer,
    relationInstanceContainer,
    namespaceInstanceContainer,
    typeGap,
    typeDictionary,
    span,
    typeName,
    toolBarHeight,
    id = null
  ) {
    this.#editorID = editorID
    this.#id = id
    this.#attributeInstanceContainer = attributeInstanceContainer
    this.#relationInstanceContainer = relationInstanceContainer
    this.#typeGap = typeGap
    this.#typeDictionary = typeDictionary
    this.#namespaceInstanceContainer = namespaceInstanceContainer
    this.#toolBarHeight = toolBarHeight

    // Preprocessing is required, so use the property
    this.span = span
    this.typeName = typeName
  }

  get id() {
    return this.#id
  }

  set id(val) {
    this.#id = val
  }

  get title() {
    return `[${this.id}] pred: type, value: ${this.#typeName}`
  }

  get color() {
    return this.#definitionContainer.getColor(this.typeName)
  }

  get anchorHTML() {
    return toAnchorElement(this.#displayName, this.#href)
  }

  get span() {
    return this.#span
  }

  set span(val) {
    this.#span = val
    val.add(this)
  }

  get typeName() {
    return this.#typeName
  }

  set typeName(val) {
    // Replace null to 'null' if type is null and undefined too.
    this.#typeName = String(val)
  }

  get typeValues() {
    return new TypeValues(
      this.#typeName,
      this.#attributeInstanceContainer.getAttributesFor(this.#id)
    )
  }

  get relations() {
    return this.relationsWhereThisIsSource.concat(
      this.relationsWhereThisIsTarget
    )
  }

  /**
   * @returns {import('./AnnotationModel/AttributeInstanceContainer/AttributeInstance.js').AttributeInstance[]}
   */
  get attributes() {
    return this.#attributeInstanceContainer.getAttributesFor(this.#id)
  }

  get relationsWhereThisIsSource() {
    return this.#relationInstanceContainer.all.filter((r) => r.subj === this.id)
  }

  get relationsWhereThisIsTarget() {
    return this.#relationInstanceContainer.all.filter((r) => r.obj === this.id)
  }

  get hasMultipleEndpoints() {
    const relations = new Map()
    relations.set('whereThisIsSourceAndTargetIsOnTheLeft', new Set())
    relations.set('whereThisIsSourceAndTargetIsOnTheRight', new Set())
    relations.set('whereThisIsSourceAndTargetIsUpOrDown', new Set())

    for (const r of this.relationsWhereThisIsSource) {
      if (r.targetEntity.offsetCenter < this.offsetCenter) {
        relations.get('whereThisIsSourceAndTargetIsOnTheLeft').add(r)
      } else if (this.offsetCenter < r.targetEntity.offsetCenter) {
        relations.get('whereThisIsSourceAndTargetIsOnTheRight').add(r)
      } else {
        relations.get('whereThisIsSourceAndTargetIsUpOrDown').add(r)
      }
    }

    relations.set('whereThisIsTargetAndSourceIsOnTheLeft', new Set())
    relations.set('whereThisIsTargetAndSourceIsOnTheRight', new Set())
    relations.set('whereThisIsTargetAndSourceIsUpOrDown', new Set())

    for (const r of this.relationsWhereThisIsTarget) {
      if (r.sourceEntity.offsetCenter < this.offsetCenter) {
        relations.get('whereThisIsTargetAndSourceIsOnTheLeft').add(r)
      } else if (this.offsetCenter < r.targetEntity.offsetCenter) {
        relations.get('whereThisIsTargetAndSourceIsOnTheRight').add(r)
      } else {
        relations.get('whereThisIsTargetAndSourceIsUpOrDown').add(r)
      }
    }

    return [...relations.values()].filter((s) => s.size).length > 1
  }

  get clientTop() {
    const { span } = this

    // Calculates the top without referencing the HTML element of entities.
    if (span.isDenotation) {
      let top = span.clientTopOfGrid + this.#typeGap.height

      for (const entity of span.entities) {
        if (entity === this) {
          break
        }

        top += this.#typeGap.height + entity.height
      }

      return round(top)
    }

    if (span.isBlock) {
      const paddingBottomOfGridOfBlockSpan = 15
      return round(
        span.clientBottomOfGrid - this.height - paddingBottomOfGridOfBlockSpan
      )
    }

    throw new Error('Unexpected type of span')
  }

  get offsetTop() {
    return (
      this.clientTop -
      this.span.element.offsetParent.offsetParent.getBoundingClientRect().top
    )
  }

  get clientBottom() {
    return this.clientTop + this.height
  }

  isInViewport(clientHeight) {
    return (
      this.#toolBarHeight <= this.clientBottom && this.clientTop <= clientHeight
    )
  }

  get width() {
    return this.span.widthOfGrid
  }

  get height() {
    const labelUnitHeight = 18

    return labelUnitHeight + this.#attributesHeight
  }

  get heightWithTypeGap() {
    return this.height + this.#typeGap.height
  }

  get offsetCenter() {
    return round(this.span.offsetCenterOfGrid)
  }

  get isDenotation() {
    return this.#span.isDenotation
  }

  get isBlock() {
    return this.#span.isBlock
  }

  get isSelected() {
    return this.#isSelected
  }

  getSourceAnchorPosition(alignBollards) {
    // When the entity width is small and the endpoint is displayed in the center of the entity and the entity has only one endpoint,
    // hovering will not move the entity left or right.
    const isJettyDeployed =
      this.width / 2 >= MinimumDistance ||
      (this.hasMultipleEndpoints && alignBollards)

    return {
      left: isJettyDeployed
        ? this.offsetCenter - DistanceToShift * 3
        : this.offsetCenter,
      right: isJettyDeployed
        ? this.offsetCenter + DistanceToShift * 3
        : this.offsetCenter
    }
  }

  getTargetAnchorPosition(alignBollards) {
    // When the entity width is small and the endpoint is displayed in the center of the entity and the entity has only one endpoint,
    // hovering will not move the entity left or right.
    const isJettyDeployed =
      this.width / 2 >= MinimumDistance ||
      (this.hasMultipleEndpoints && alignBollards)

    return {
      left: isJettyDeployed
        ? this.offsetCenter - DistanceToShift
        : this.offsetCenter,
      right: isJettyDeployed
        ? this.offsetCenter + DistanceToShift
        : this.offsetCenter
    }
  }

  focus() {
    if (this.isDenotation) {
      this.span.focus()
    } else if (this.isBlock) {
      // Entities outside the drawing area are not rendered.
      // Attempting to focus will result in an error.
      // Force rendering before focusing.
      this.span.forceRenderGrid()
      this.#signboard.focus()
    } else {
      throw new Error('Unexpected type of entity')
    }
  }

  select() {
    if (!this.#isSelected) {
      this.#isSelected = true
      this.#selectElement()
      this.#updateRelationHighlighting()
    }
  }

  deselect() {
    if (this.#isSelected) {
      this.#isSelected = false
      if (this.#signboard) {
        this.#signboard.deselect()
      }
      this.#updateRelationHighlighting()
    }
  }

  startCut() {
    if (this.#signboard) {
      this.#signboard.startCut()
    }
  }

  cancelCut() {
    if (this.#signboard) {
      this.#signboard.cancelCut()
    }
  }

  render() {
    if (this.#signboard) {
      return
    }

    if (this.span.isGridRendered) {
      // Append a new entity to the type
      this.#signboard = this.#createSignboardElement()
      this.span.addEntityElementToGridElement(this.#signboard.element)

      this.reflectTypeGapInTheHeight()

      for (const entity of this.span.entities.filter((e) => e !== this)) {
        for (const relation of entity.relations) {
          relation.redrawLineConsideringSelection()
        }
      }

      // When scrolling out of a selected entity and then scrolling in again,
      // the selected state will be highlighted.
      if (this.#isSelected) {
        this.#signboard.select()
      }
    }
  }

  updateElement() {
    if (this.#signboard) {
      this.#signboard = this.#signboard.replaceWith(
        this.#createSignboardElement()
      )

      // Re-select a new entity element.
      if (this.#isSelected) {
        this.#selectElement()
      }

      this.reflectTypeGapInTheHeight()

      this.span.updateSelfAndAncestorsGridPosition()
      for (const entity of this.span.entities) {
        for (const relation of entity.relations) {
          relation.redrawLineConsideringSelection()
        }
      }
    }
  }

  reflectTypeGapInTheHeight() {
    if (this.isDenotation && this.#signboard) {
      this.#signboard.reflectTypeGapInTheHeight(this.#typeGap.height)
    }
  }

  clarifyLabel() {
    if (this.#signboard) {
      this.#signboard.clarifyLabel()
    }
    this.#isLabelClarified = true
  }

  declarifyLabel() {
    if (!this.#isHovered && this.#signboard) {
      this.#signboard.declarifyLabel()
    }
    this.#isLabelClarified = false
  }

  erase() {
    if (this.#signboard) {
      this.#signboard.remove()
      this.#signboard = null
      this.span.updateSelfAndAncestorsGridPosition()
    }
  }

  #createSignboardElement() {
    const signboard = new SignboardHTMLElement(
      this,
      this.isDenotation ? 'denotation' : 'block',
      `${this.#editorID}__E${this.id.replace(/[:¥.]/g, '')}`
    )

    // Highlight relations when related entity is hovered.
    signboard.addEventListener('mouseenter', () => {
      signboard.clarifyLabel()
      this.#pointUpRelations()
      this.#isHovered = true
    })
    signboard.addEventListener('mouseleave', () => {
      if (!this.#isLabelClarified) {
        signboard.declarifyLabel()
      }
      this.#updateRelationHighlighting()
      this.#isHovered = false
    })

    return signboard
  }

  #selectElement() {
    // Force rendering to select and focus on entities outside the display area.
    this.span.forceRenderGrid()
    this.#signboard.select()

    // The block span renders as a div HTML element.
    // Because the positioning of div HTML elements is slower than that of span HTML elements,
    // block span grids do not move at render time.
    // Focusing before moving causes the browser to scroll to the top of the document.
    // So focus after the move, not at render time.
    if (this.span.isGridBeforePositioned) {
      this.span.entityToFocusOn = this
    } else {
      // Set focus in order to scroll the browser to the position of the element.
      this.focus()
    }
  }

  /** @return {import('./AnnotationModel/DefinitionContainer/index.js').default} */
  get #definitionContainer() {
    if (this.isDenotation) {
      return this.#typeDictionary.denotation
    } else if (this.isBlock) {
      return this.#typeDictionary.block
    } else {
      throw 'unknown entity type'
    }
  }

  get #displayName() {
    return getDisplayName(
      this.#namespaceInstanceContainer,
      this.typeName,
      this.#definitionContainer.getLabel(this.typeName)
    )
  }

  get #href() {
    return getURI(
      this.#namespaceInstanceContainer,
      this.typeName,
      this.#definitionContainer.getURI(this.typeName)
    )
  }

  get #attributesHeight() {
    return this.attributes
      .map(({ height }) => height)
      .reduce((sum, height) => sum + height, 0)
  }

  #pointUpRelations() {
    for (const relation of this.relationsWhereThisIsSource) {
      relation.pointUpPathAndSourceBollards()
    }
    for (const relation of this.relationsWhereThisIsTarget) {
      relation.pointUpPathAndTargetBollards()
    }
  }

  #updateRelationHighlighting() {
    for (const relation of this.relations) {
      relation.redrawLineConsideringSelection()
    }
  }
}
