import readFile from './readFile'
import isJSON from '../../../isJSON'
import DataSource from '../../DataSource'

export default function (file, eventEmitter) {
  readFile(file).then(({ target }) => {
    if (isJSON(target.result)) {
      eventEmitter.emit(
        'textae-event.resource.configuration.load.success',
        DataSource.createFileSource(file.name, JSON.parse(target.result))
      )
    } else {
      eventEmitter.emit(
        'textae-event.resource.configuration.format.error',
        DataSource.createFileSource(file.name)
      )
    }
  })
}
