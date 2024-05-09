import DataSource from './DataSource'

export default function loadAnnotation(eventEmitter, annotation) {
  if (!annotation.text) {
    return false
  }

  eventEmitter.emit(
    'textae-event.resource.annotation.load.success',
    DataSource.createInstantSource(annotation)
  )

  return true
}
