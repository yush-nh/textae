import debounce from 'debounce'

export default class AnnotationAutoSaver {
  #controlViewModel

  constructor(
    eventEmitter,
    controlViewModel,
    persistenceInterface,
    saveToParameter,
    annotationModelEventsObserver
  ) {
    this.#controlViewModel = controlViewModel

    const debounceSaveAnnotation = debounce(
      () => persistenceInterface.saveAnnotation(),
      5000
    )

    eventEmitter
      .on('textae-event.resource.annotation.load.success', () =>
        this.#disabled()
      )
      .on('textae-event.resource.save.error', () => this.#disabled())
      .on('textae-event.resource.annotation.url.set', (dataSource) =>
        eventEmitter.emit(
          'textae-event.annotation-auto-saver.enable',
          Boolean(saveToParameter || dataSource.id)
        )
      )
      .on('textae-event.control.button.push', ({ name, isPushed }) => {
        // If there is something to save when the 'upload automatically' button is pushed,
        // it will be saved immediately.
        if (
          name === 'upload automatically' &&
          isPushed === true &&
          annotationModelEventsObserver.hasChange
        ) {
          persistenceInterface.saveAnnotation()
        }
      })
      .on(
        'textae-event.annotation-data.events-observer.unsaved-change',
        (val) => {
          if (val && controlViewModel.isPushed('upload automatically')) {
            debounceSaveAnnotation()
          }
        }
      )
  }

  #disabled() {
    if (this.#controlViewModel.isPushed('upload automatically')) {
      this.#controlViewModel.toggleButton('upload automatically')
    }
  }
}
