import TypeValues from '../TypeValues'
import { makeEntityHTMLElementId } from '../idFactory'
import mergeTypesOf from './mergeTypesOf'
import SELECTED from '../SELECTED'
import createEntityHTMLElement from './createEntityHTMLElement'
import typeGapUnitHeight from '../typeGapUnitHeight'

export default class EntityModel {
  constructor(
    editor,
    attributeContainer,
    relationContaier,
    entityGap,
    typeDefinition,
    span,
    typeName,
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
  }

  static mergedTypesOf(entities) {
    return mergeTypesOf(entities)
  }

  static rejectSameType(entities, typeName, attributes) {
    return entities.filter((e) => !e._isSameType(typeName, attributes))
  }

  static filterWithSamePredicateAttribute(entities, pred) {
    return entities.filter((e) => e._hasSpecificPredicateAttribute(pred))
  }

  // An entity cannot have more than one attribute with the same predicate.
  static filterWithoutSamePredicateAttribute(entities, pred) {
    return entities.filter((e) => !e._hasSpecificPredicateAttribute(pred))
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

  get typeValues() {
    return new TypeValues(this._typeName, this.attributes)
  }

  get attributes() {
    return this._attributeContainer.all.filter((a) => a.subj === this._id)
  }

  getDifferentAttributes(newAttributes) {
    return this.attributes.filter(
      (oldA) =>
        !newAttributes.some(
          (newA) => oldA.pred === newA.pred && oldA.obj === newA.obj
        )
    )
  }

  get relations() {
    return this._relationContaier.all.filter(
      (r) => r.obj === this.id || r.subj === this.id
    )
  }

  _toHTMLElementContext(namespace, typeContainer, attributeContainer) {
    return Object.assign(
      {
        id: makeEntityHTMLElementId(this._editor, this.id),
        title: this.id
      },
      this.typeValues.toHTMLElementContext(
        namespace,
        typeContainer,
        attributeContainer
      )
    )
  }

  _isSameType(typeName, attributes) {
    return this.typeName === typeName && this._hasSameAttributes(attributes)
  }

  _hasSameAttributes(newAttributes) {
    if (newAttributes.length != this.attributes.length) {
      return false
    }

    return (
      newAttributes.filter((a) =>
        this.attributes.some(
          (b) => a.pred === b.pred && a.obj === String(b.obj)
        )
      ).length == this.attributes.length
    )
  }

  _hasSpecificPredicateAttribute(pred) {
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
      el.querySelector('.textae-editor__entity__type-label').focus()
    }
  }

  deselect() {
    this.element.classList.remove(SELECTED)
  }

  renderElement(namespace, attributeContainer) {
    const contex = this._toHTMLElementContext(
      namespace,
      this._typeContainerFor,
      attributeContainer
    )
    return createEntityHTMLElement(contex)
  }

  updateElement(namespace, attributeContainer, isSelected) {
    const element = this.renderElement(namespace, attributeContainer)
    this.element.replaceWith(element)

    // Re-select a new entity element.
    if (isSelected) {
      this.select()
    }
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

  get _typeContainerFor() {
    if (this.isDenotation) {
      return this._typeDefinition.denotation
    } else if (this.isBlock) {
      return this._typeDefinition.block
    } else {
      throw 'unknown entity type'
    }
  }
}
