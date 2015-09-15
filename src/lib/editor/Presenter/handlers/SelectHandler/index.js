import selectSpan from './selectSpan'
import selectEntityLabel from './selectEntityLabel'
import selectEntity from './selectEntity'
import {
  getLeftElement, getRightElement
}
from '../../../getNextElement'

export default function(editor, annotationData, selectionModel, typeContainer) {
  let editorDom = editor[0]

  return {
    selectLeft: (option) => selectLeft(editorDom, annotationData, selectionModel, typeContainer, option.shiftKey),
    selectRight: (option) => selectRight(editorDom, annotationData, selectionModel, typeContainer, option.shiftKey),
    selectUp: () => selectUpperLayer(editorDom, annotationData, selectionModel),
    selectDown: () => selectLowerLayer(editorDom, annotationData, selectionModel)
  }
}

function selectLeft(editorDom, annotationData, selectionModel, typeContainer, shiftKey) {
  // When one span is selected.
  let spanId = selectionModel.span.single()
  if (spanId) {
    let span = getLeftElement(editorDom, document.querySelector(`#${spanId}`))
    if (span)
      selectSpan(selectionModel, span.id)
    return
  }

  // When one entity label is selected.
  let labels = editorDom.querySelectorAll('.textae-editor__type-label.ui-selected')
  if (labels.length === 1) {
    let label = getLeftElement(editorDom, labels[0])
    selectEntityLabel(selectionModel, label)
    return
  }

  // When one entity is selected.
  let entityId = selectionModel.entity.single()
  if (entityId) {
    let entity = getLeftElement(editorDom, getEntityDom(editorDom, entityId))
    selectEntity(selectionModel, entity)
    return
  }
}

function selectRight(editorDom, annotationData, selectionModel, typeContainer, shiftKey) {
  // When one span is selected.
  let spanId = selectionModel.span.single()
  if (spanId) {
    let span = getRightElement(editorDom, document.querySelector(`#${spanId}`))
    if (span)
      selectSpan(selectionModel, span.id)
    return
  }

  // When one entity lable is selected.
  let labels = editorDom.querySelectorAll('.textae-editor__type-label.ui-selected')
  if (labels.length === 1) {
    let label = getRightElement(editorDom, labels[0])
    selectEntityLabel(selectionModel, label)
    return
  }

  // When one entity is selected.
  let entityId = selectionModel.entity.single()
  if (entityId) {
    let entity = getRightElement(editorDom, getEntityDom(editorDom, entityId))
    selectEntity(selectionModel, entity)
    return
  }
}

function selectUpperLayer(editorDom, annotationData, selectionModel) {
  // When one span is selected.
  let spanId = selectionModel.span.single()
  if (spanId) {
    selectFirstEntityLabelOfSpan(selectionModel, spanId)
    return
  }

  // When one entity label is selected.
  let labels = editorDom.querySelectorAll('.textae-editor__type-label.ui-selected')
  if (labels.length === 1) {
    selectFirstEntityOfEntityLabel(selectionModel, labels[0])
    return
  }
}

function selectLowerLayer(editorDom, annotationData, selectionModel) {
  // When one entity label is selected.
  let labels = editorDom.querySelectorAll('.textae-editor__type-label.ui-selected')
  if (labels.length === 1) {
    selectSpanOfEntityLabel(selectionModel, labels[0])
    return
  }

  // When one entity is selected.
  let entityId = selectionModel.entity.single()
  if (entityId) {
    selectLabelOfEntity(editorDom, selectionModel, entityId)
    return
  }
}

function selectFirstEntityLabelOfSpan(selectionModel, spanId) {
  let grid = document.querySelector(`#G${spanId}`)

  // Block span has no grid.
  if (grid) {
    let type = grid.querySelector('.textae-editor__type'),
      label = type.querySelector('.textae-editor__type-label')

    selectEntityLabel(selectionModel, label)
  }
}

function selectFirstEntityOfEntityLabel(selectionModel, label) {
  let pane = label.nextElementSibling

  selectEntity(selectionModel, pane.children[0])
}

function selectSpanOfEntityLabel(selectionModel, label) {
  console.assert(label, 'A label MUST exists.')

  let spanId = label.closest('.textae-editor__grid').id.substring(1)
  selectSpan(selectionModel, spanId)
}

function selectLabelOfEntity(editorDom, selectionModel, entityId) {
  console.assert(entityId, 'An entityId MUST exists.')

  let entityDom = getEntityDom(editorDom, entityId)
  selectEntityLabel(selectionModel, entityDom.parentNode.previousElementSibling)
}

function getEntityDom(editorDom, entityId) {
  return editorDom.querySelector(`[title="${entityId}"]`)
}
