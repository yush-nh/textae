import createDownloadPath from '../../createDownloadPath'
import JSONAnnotationConverter from '../../../JSONAnnotationConverter'

export default async function createDownloadPathForFormat(data, format) {
  if (format === 'json') {
    return createDownloadPath(data)
  } else if (format === 'inline') {
    const inlineData = await JSONAnnotationConverter.toInline(data)

    const blob = new Blob([inlineData], { type: 'text/plain' })
    return URL.createObjectURL(blob)
  }
}
