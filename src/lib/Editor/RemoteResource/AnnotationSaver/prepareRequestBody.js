import JSONAnnotationConverter from '../../../JSONAnnotationConverter'

export default async function prepareRequestBody(editedData, format) {
  if (format === 'json') {
    return JSON.stringify(editedData)
  } else if (format === 'inline') {
    return await new JSONAnnotationConverter(
      'https://pubannotation.org/conversions/json2inline'
    ).toInline(editedData)
  }
}
