// model manages data objects.
import AnnotationModel from './AnnotationModel'
import UseCase from './UseCase'
import { EventEmitter } from 'events'
import StartUpOptions from './StartUpOptions'
import EditorCSSClass from './EditorCSSClass'
import forwardMethods from './forwardMethods'
import observeElement from './observeElement'
import observeEventEmitter from './observeEventEmitter'
import editorCSSClassObserve from './editorCSSClassObserve'
import isAndroid from './isAndroid'
import EditorEventListener from './EditorEventListener'
import loadAnnotation from './loadAnnotation'
import BrowserEventListener from './BrowserEventListener'
import SelectionModel from './SelectionModel'
import filterIfModelModified from './filterIfModelModified'

export default class Editor {
  #element
  #annotationModel
  #eventEmitter
  #inspector
  #lastSelectedDenotationIDCallback
  #scrollEventListeners
  #useCase

  constructor(
    element,
    editorID,
    mousePoint,
    startJQueryUIDialogWait,
    endJQueryUIDialogWait
  ) {
    // Add tabIndex to listen to keyboard events.
    element.tabIndex = -1

    if (isAndroid()) {
      element.classList.add('textae-editor--android')
    }

    observeElement(element)

    // Set the eventEmitter to communicate with the tool and a control.
    const eventEmitter = new EventEmitter()
    observeEventEmitter(eventEmitter)

    const editorCSSClass = new EditorCSSClass(element)
    editorCSSClassObserve(eventEmitter, editorCSSClass)

    const startUpOptions = new StartUpOptions(element)
    const annotationModel = new AnnotationModel(
      editorID,
      element,
      eventEmitter,
      editorCSSClass,
      startJQueryUIDialogWait,
      endJQueryUIDialogWait,
      startUpOptions.configLock === 'true',
      startUpOptions.additionalPaddingTop
    )

    this.#element = element
    this.#annotationModel = annotationModel
    this.#eventEmitter = eventEmitter

    if (startUpOptions.inspect) {
      const callback = (annotation) => {
        const destinationElement = document.querySelector(
          `#${startUpOptions.inspect}`
        )
        if (destinationElement) {
          destinationElement.textContent = JSON.stringify(annotation, null, 2)
        }
      }
      this.#newInspector(callback)
    }
    this.#scrollEventListeners = this.#observeScrollEvent(
      annotationModel,
      element
    )

    // A container of selection state.
    const selectionModel = new SelectionModel(eventEmitter, annotationModel)
    const useCase = new UseCase(
      element,
      editorID,
      mousePoint,
      eventEmitter,
      annotationModel,
      startUpOptions,
      selectionModel
    )
    this.#useCase = useCase

    forwardMethods(this, () => useCase, [
      'copyEntitiesToSystemClipboard',
      'cutEntitiesToSystemClipboard',
      'pasteEntitiesFromSystemClipboard',
      'activate',
      'deactivate',
      'applyTextSelectionWithTouchDevice',
      'showContextMenu',
      'hideContextMenu',
      'focusDenotation'
    ])
    forwardMethods(this, () => selectionModel, ['selectDenotation'])
    forwardMethods(this, () => annotationModel, [
      'drawGridsInSight',
      'reLayout'
    ])
  }

  updateDenotationEntitiesWidth() {
    for (const span of this.#annotationModel.spanInstanceContainer
      .allDenotationSpans) {
      span.updateDenotationEntitiesWidth()
    }
  }

  load(annotation) {
    loadAnnotation(this.#eventEmitter, annotation)
  }

  setInspector(callback) {
    if (this.#inspector) {
      this.#inspector.dispose()
      this.#inspector = null
    }

    if (typeof callback == 'function') {
      this.#inspector = this.#newInspector(callback)
    }
  }

  setLastSelectedDenotationIDCallback(callback) {
    if (this.#lastSelectedDenotationIDCallback) {
      this.#lastSelectedDenotationIDCallback.dispose()
      this.#lastSelectedDenotationIDCallback = null
    }

    if (typeof callback == 'function') {
      this.#lastSelectedDenotationIDCallback = new EditorEventListener(
        this.#eventEmitter,
        'textae-event.selection-model.last-selected-denotation-id.change',
        callback
      )
    }
  }

  get HTMLElementID() {
    return this.#element.id
  }

  dispose() {
    // There is an event listener that monitors scroll events.
    // The event listener is released when the editor is deleted.
    for (const listener of this.#scrollEventListeners) {
      listener.dispose()
    }
  }

  focusDenotation(denotationID) {
    if (!this.#annotationModel.denotations.has(denotationID)) {
      throw new Error(`Denotation ${denotationID} not found`)
    }

    this.#useCase.focusDenotation(denotationID)
  }

  #observeScrollEvent(annotationModel, element) {
    const scrollEventListeners = new Set()

    // Draws the entity when the editor is scrolled and the entity enters the display area.
    const showHideElements = () => annotationModel.drawGridsInSight()
    const listener = new BrowserEventListener(
      element,
      'scroll',
      showHideElements
    )
    scrollEventListeners.add(listener)

    // Draws the entity when the editor's ancestor element is scrolled and
    // the entity enters the display area.
    const container = element.closest('.textae-container')
    if (container) {
      const listener = new BrowserEventListener(
        container,
        'scroll',
        showHideElements
      )
      scrollEventListeners.add(listener)
    }

    return scrollEventListeners
  }

  #newInspector(callback) {
    return new EditorEventListener(
      this.#eventEmitter,
      'textae-event.annotation-data.events-observer.change',
      filterIfModelModified(this.#annotationModel, callback)
    )
  }
}
