import InstanceContainer from './InstanceContainer'
import SpanInstanceContainer from './SpanInstanceContainer'
import AttributeInstanceContainer from './AttributeInstanceContainer'
import RelationInstanceContainer from './RelationInstanceContainer'
import EntityInstanceContainer from './EntityInstanceContainer'
import AnnotationParser from './AnnotationParser'
import clearAnnotationModel from './clearAnnotationModel'
import toDenotations from './toDenotations'
import toRelations from './toRelations'
import toBlocks from './toBlocks'
import getReplicationRanges from './getReplicationRanges'
import TypeGap from './TypeGap'
import createTextBox from './createTextBox'
import TypeDefinition from './TypeDefinition'
import DefinitionContainer from './DefinitionContainer'
import AttributeDefinitionContainer from '../AttributeDefinitionContainer'
import getAnnotationBox from './getAnnotationBox'
import LineHeightAuto from './LineHeightAuto'

export default class AnnotationModel {
  #sourceDoc
  #typeGap
  #textBox
  #lineHeightAuto
  #span
  #attribute
  #typeDefinition
  #editorHTMLElement
  #eventEmitter

  constructor(
    editorID,
    editorHTMLElement,
    eventEmitter,
    editorCSSClass,
    startJQueryUIDialogWait,
    endJQueryUIDialogWait,
    isConfigLocked,
    additionalPaddingTop
  ) {
    this.#sourceDoc = ''
    this.namespace = new InstanceContainer(eventEmitter, 'namespace')
    const relationDefinitionContainer = new DefinitionContainer(
      eventEmitter,
      'relation',
      () => this.relation.all,
      '#00CC66'
    )

    this.relation = new RelationInstanceContainer(
      editorHTMLElement,
      eventEmitter,
      this,
      relationDefinitionContainer
    )
    this.#typeGap = new TypeGap(() => {
      for (const entity of this.entity.denotations) {
        entity.reflectTypeGapInTheHeight()
      }
      this.#textBox.updateLineHeight()
      eventEmitter.emit('textae-event.annotation-data.entity-gap.change')
    })

    this.entity = new EntityInstanceContainer(
      editorID,
      eventEmitter,
      this,
      this.#typeGap
    )

    this.attributeDefinitionContainer = new AttributeDefinitionContainer(
      eventEmitter,
      () => this.#attribute.all
    )
    this.#attribute = new AttributeInstanceContainer(
      eventEmitter,
      this.entity,
      this.relation,
      this.namespace,
      this.attributeDefinitionContainer
    )

    this.updatePosition = () => {
      try {
        editorCSSClass.startWait()
        startJQueryUIDialogWait()

        this.#rearrangeAllAnnotations()
      } catch (e) {
        console.error(e)
      } finally {
        editorCSSClass.endWait()
        endJQueryUIDialogWait()
      }
    }
    this.#textBox = createTextBox(editorHTMLElement, this, additionalPaddingTop)
    this.#lineHeightAuto = new LineHeightAuto(eventEmitter, this.#textBox)
    this.#span = new SpanInstanceContainer(
      editorID,
      editorHTMLElement,
      eventEmitter,
      this.entity,
      this.#textBox
    )

    this.denotationDefinitionContainer = new DefinitionContainer(
      eventEmitter,
      'entity',
      () => this.entity.denotations,
      '#77DDDD'
    )
    const blockDefinitionContainer = new DefinitionContainer(
      eventEmitter,
      'entity',
      () => this.entity.blocks,
      '#77DDDD'
    )
    this.#typeDefinition = new TypeDefinition(
      eventEmitter,
      this.denotationDefinitionContainer,
      blockDefinitionContainer,
      relationDefinitionContainer,
      this.attributeDefinitionContainer,
      isConfigLocked
    )

    eventEmitter
      .on('textae-event.annotation-data.span.add', (span) => {
        if (span.isDenotation || span.isBlock) {
          this.#textBox.forceUpdate()
          this.#rearrangeAllAnnotations()
        }
      })
      .on('textae-event.annotation-data.span.remove', (span) => {
        if (span.isDenotation || span.isBlock) {
          this.#textBox.forceUpdate()
          this.#rearrangeAllAnnotations()
        }
      })
      .on('textae-event.annotation-data.entity.add', (entity) => {
        if (entity.span.isDenotation) {
          this.#lineHeightAuto.updateLineHeight()
        }
      })
      .on('textae-event.annotation-data.entity.remove', (entity) => {
        if (entity.span.isDenotation) {
          this.#lineHeightAuto.updateLineHeight()
        }
      })

    // Bind type-definition events.
    eventEmitter
      .on('textae-event.type-definition.entity.change', (typeName) => {
        for (const entity of this.entity.all) {
          // If the type name ends in a wildcard, look for the DOMs to update with a forward match.
          if (
            entity.typeName === typeName ||
            (typeName.lastIndexOf('*') === typeName.length - 1 &&
              entity.typeName.indexOf(typeName.slice(0, -1) === 0))
          ) {
            entity.updateElement()
          }
        }
      })
      .on('textae-event.type-definition.attribute.change', (pred) =>
        this.entity.redrawEntitiesWithSpecifiedAttribute(pred)
      )
      .on('textae-event.type-definition.attribute.move', (pred) =>
        this.entity.redrawEntitiesWithSpecifiedAttribute(pred)
      )
      .on('textae-event.type-definition.relation.change', (typeName) => {
        for (const relation of this.relation.all) {
          // If the type name ends in a wildcard, look for the DOMs to update with a forward match.
          if (
            relation.typeName === typeName ||
            (typeName.lastIndexOf('*') === typeName.length - 1 &&
              relation.typeName.indexOf(typeName.slice(0, -1) === 0))
          ) {
            relation.updateElement()
          }
        }
      })

    this.#editorHTMLElement = editorHTMLElement
    this.#eventEmitter = eventEmitter
  }

  reset(rawData, config) {
    console.assert(rawData.text, 'This is not a json file of annotations.')

    this.#typeDefinition.setTypeConfig(config)
    this.#sourceDoc = rawData.text
    this.#textBox.render(this.sourceDoc)

    clearAnnotationModel(this)
    const {
      namespace,
      spanInstanceContainer,
      entity,
      attributeInstanceContainer,
      relation
    } = this
    const annotationParser = new AnnotationParser(
      namespace,
      spanInstanceContainer,
      entity,
      attributeInstanceContainer,
      relation,
      rawData
    )
    annotationParser.parse()

    this.#clearAndDrawAllAnnotations()

    this.#eventEmitter.emit(
      'textae-event.annotation-data.all.change',
      this,
      annotationParser.hasMultiTracks,
      annotationParser.rejects
    )

    // When reading some annotation Grid may be drawn out of alignment.
    // For example, http://pubannotation.org/projects/GlyCosmos6-Glycan-Motif-Structure/docs/sourcedb/PubMed/sourceid/3571288/annotations.json .
    // This seems to happen especially when the browser is wide with only one editor.
    // The true cause is unknown, but it can be avoided by doing the layout twice.
    this.reLayout()
  }

  get externalFormat() {
    return {
      denotations: toDenotations(this),
      attributes: this.#attribute.all.map(
        ({ externalFormat }) => externalFormat
      ),
      relations: toRelations(this),
      blocks: toBlocks(this)
    }
  }

  getReplicationRanges(span, isDelimiterFunc) {
    return getReplicationRanges(
      this.sourceDoc,
      span.begin,
      span.end,
      this.#span,
      isDelimiterFunc
    )
  }

  get typeGap() {
    return this.#typeGap
  }

  get textBox() {
    return this.#textBox
  }

  get sourceDoc() {
    // Since 6.0.0, the text-box is set to "white-space: pre-wrap;"
    // in order to render line breaks contained in text as they are in the browser.
    // "\r\n" is rendered as a single character.
    // Replace "\r\n" with "\n" so that the browser can render "\r\n" as two characters.
    return this.#sourceDoc.replaceAll(/\r\n/g, ' \n')
  }

  get typeDefinition() {
    return this.#typeDefinition
  }

  get spanInstanceContainer() {
    return this.#span
  }

  get attributeInstanceContainer() {
    return this.#attribute
  }

  getInstanceContainerFor(annotationType) {
    switch (annotationType) {
      case 'span':
        return this.#span
      case 'relation':
        return this.relation
      case 'entity':
        return this.entity
      case 'attribute':
        return this.#attribute
    }
  }

  drawGridsInSight() {
    if (this.#isEditorInSight) {
      const { clientHeight, clientWidth } = document.documentElement

      for (const span of this.#span.allDenotationSpans) {
        span.drawGrid(clientHeight, clientWidth)
      }

      for (const span of this.#span.allBlockSpans) {
        span.drawGrid(clientHeight, clientWidth)
        span.updateBackgroundPosition()
      }

      for (const relation of this.relation.all) {
        relation.render(clientHeight, clientWidth)
      }
    }
  }

  reLayout() {
    this.#textBox.forceUpdate()

    if (this.#isEditorInSight) {
      this.updatePosition()
    }
  }

  /** @param {number} value */
  set toolBarHeight(value) {
    this.entity.toolBarHeight = value
    this.relation.toolBarHeight = value
  }

  get #isEditorInSight() {
    const { clientHeight } = document.documentElement
    const { top, bottom } = this.#editorHTMLElement.getBoundingClientRect()

    return 0 <= bottom && top <= clientHeight
  }

  focusDenotation(denotationID) {
    console.assert(
      this.entity.hasDenotation(denotationID),
      'The denotation does not exist.'
    )

    const { span } = this.entity.get(denotationID)
    span.focus()
  }

  #clearAndDrawAllAnnotations() {
    getAnnotationBox(this.#editorHTMLElement).innerHTML = ''

    this.#textBox.updateLineHeight()

    for (const span of this.#span.topLevel) {
      span.render()
    }

    // Reflects the addition and deletion of line breaks by span.
    this.#textBox.forceUpdate()

    const { clientHeight, clientWidth } = document.documentElement

    for (const span of this.#span.allDenotationSpans) {
      span.drawGrid(clientHeight, clientWidth)
    }

    for (const span of this.#span.allBlockSpans) {
      span.drawGrid(clientHeight, clientWidth)
    }

    for (const relation of this.relation.all) {
      relation.render(clientHeight, clientWidth)
    }
  }

  #rearrangeAllAnnotations() {
    this.#span.arrangeDenotationEntityPosition()

    // When you undo the deletion of a block span,
    // if you move the background first, the grid will move to a better position.
    this.#span.arrangeBackgroundOfBlockSpanPosition()
    this.#span.arrangeBlockEntityPosition()

    for (const relation of this.relation.all) {
      // The Grid disappears while the span is moving.
      if (
        relation.sourceEntity.span.isGridRendered &&
        relation.targetEntity.span.isGridRendered
      ) {
        relation.redrawLineConsideringSelection()
      }
    }
  }
}
