export default class JSONAnnotationConverter {
  static async toInline(jsonAnnotation) {
    const url = 'https://pubannotation.org/conversions/json2inline'
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(jsonAnnotation),
      headers: {
        'Content-type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorMessage = await response.text()
      throw Error(errorMessage)
    }

    return await response.text()
  }
}
