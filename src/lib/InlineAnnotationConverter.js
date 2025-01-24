export default class InlineAnnotationConverter {
  static async toJSON(inlineAnnotation) {
    const url = 'https://pubannotation.org/conversions/inline2json'
    const response = await fetch(url, {
      method: 'POST',
      body: inlineAnnotation,
      headers: {
        'Content-type': 'text/markdown'
      }
    })

    if (!response.ok) {
      const errorMessage = await response.text()
      throw Error(errorMessage)
    }

    return await response.json()
  }
}
