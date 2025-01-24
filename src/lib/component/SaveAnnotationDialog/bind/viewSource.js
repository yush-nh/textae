import createDownloadPathForFormat from './createDownloadPathForFormat'

export default async function viewSource(data, format, eventEmitter) {
  const downloadPath = await createDownloadPathForFormat(data, format)
  window.open(downloadPath, '_blank')

  eventEmitter.emit('textae-event.resource.annotation.save', data)
}
