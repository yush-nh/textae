import TypeValues from '../TypeValues'
import { makeEntityHTMLElementId } from '../idFactory'
import SELECTED from '../SELECTED'
import createEntityHTMLElement from './createEntityHTMLElement'
import typeGapUnitHeight from '../typeGapUnitHeight'
import getDisplayName from '../getDisplayName'
import getUri from '../getUri'

export default class EntityModel {
  constructor(
    editor,
    attributeContainer,
    relationContaier,
    entityGap,
    typeDefinition,
    span,
    typeName,
    namespace,
    id = null
  ) {
    this._editor = editor
    this._span = span
    this.typeName = typeName
    this._id = id
    this._attributeContainer = attributeContainer
    this._relationContaier = relationContaier
    this._entityGap = entityGap
    this._typeDefinition = typeDefinition
    this._namespace = namespace
  }

  get id() {
    return this._id
  }

  set id(val) {
    this._id = val
  }

  get span() {
    return this._span
  }

  set span(val) {
    this._span = val
  }

  get typeName() {
    return this._typeName
  }

  set typeName(val) {
    // Replace null to 'null' if type is null and undefined too.
    this._typeName = String(val)
  }

  isSameType(typeName, attributes = null) {
    if (attributes) {
      return this.typeName === typeName && this._hasSameAttributes(attributes)
    }

    return this.typeName === typeName
  }

  get typeValues() {
    return new TypeValues(this._typeName, this.attributes)
  }

  get attributes() {
    return this._attributeContainer.getAttributesFor(this._id)
  }

  get relations() {
    return this._relationContaier.all.filter(
      (r) => r.obj === this.id || r.subj === this.id
    )
  }

  pointUpRelations() {
    for (const relation of this.relations) {
      relation.pointUp()
    }
  }

  pointDownRelations() {
    for (const relation of this.relations) {
      relation.pointDown()
    }
  }

  _hasSameAttributes(newAttributes) {
    if (newAttributes.length != this.attributes.length) {
      return false
    }

    return (
      newAttributes.filter((a) =>
        this.attributes.some((b) => b.equalsTo(a.pred, a.obj))
      ).length == this.attributes.length
    )
  }

  hasSpecificPredicateAttribute(pred) {
    return this.attributes.some((a) => a.pred === pred)
  }

  get element() {
    return document.querySelector(
      `#${makeEntityHTMLElementId(this._editor, this.id)}`
    )
  }

  get isDenotation() {
    return this._span.isDenotation
  }

  get isBlock() {
    return this._span.isBlock
  }

  select() {
    if (!this._selected) {
      this._selected = true

      this._selectElement()
    }
  }

  deselect() {
    if (this._selected) {
      this._selected = false

      this.element.classList.remove(SELECTED)
    }
  }

  renderElement() {
    return createEntityHTMLElement({
      id: makeEntityHTMLElementId(this._editor, this.id),
      title: this.id,
      displayName: this._displayName,
      href: this._href,
      color: this._color,
      attributes: this.attributes.map(
        ({ pred, obj, displayName, href, color }) => ({
          pred,
          obj,
          title: `pred: ${pred}, value: ${obj}`,
          displayName,
          href,
          color
        })
      ),
      entityType: this.isDenotation ? 'denotation' : 'block'
    })
  }

  updateElement() {
    const element = this.renderElement()
    this.element.replaceWith(element)

    // Re-select a new entity element.
    if (this._selected) {
      this._selectElement()
    }

    this.reflectEntityGapInTheHeight()
  }

  destroyElement() {
    this.element.remove()
  }

  reflectEntityGapInTheHeight() {
    if (this.isDenotation) {
      const entityElement = this.element
      if (entityElement) {
        entityElement.setAttribute(
          'style',
          `padding-top: ${typeGapUnitHeight * this._entityGap.value}px;`
        )
      }
    }
  }

  _selectElement() {
    const el = this.element
    el.classList.add(SELECTED)

    // The block span renders as a div HTML element.
    // Because the positioning of div HTML elements is slower than that of span HTML elements,
    // block span grids do not move at render time.
    // Focusing before moving causes the browser to scroll to the top of the document.
    // So focus after the move, not at render time.
    if (this.span.isGridBeforePositioned) {
      this.span.entityToFocusOn = this
    } else {
      // Set focus to the label element in order to scroll the browser to the position of the element.
      el.querySelector('.textae-editor__signboard__type-label').focus()
    }
  }

  get _definitionContainerFor() {
    if (this.isDenotation) {
      return this._typeDefinition.denotation
    } else if (this.isBlock) {
      return this._typeDefinition.block
    } else {
      throw 'unknown entity type'
    }
  }

  get _displayName() {
    return getDisplayName(
      this._namespace,
      this.typeName,
      this._definitionContainerFor.getLabel(this.typeName)
    )
  }

  get _href() {
    return getUri(
      this._namespace,
      this.typeName,
      this._definitionContainerFor.getUri(this.typeName)
    )
  }

  get _color() {
    return this._definitionContainerFor.getColor(this.typeName)
  }
}
