export default class AnnotationResource {
  #annotation
  #sourceURL

  constructor(element, sourceURL, annotationFromQueryParameter) {
    if (annotationFromQueryParameter) {
      this.#annotation = annotationFromQueryParameter
    } else if (sourceURL) {
      this.#sourceURL = sourceURL
    } else {
      // Read annotation from inline annotation.
      const inlineAnnotation = this.#deconstructInlineAnnotation(element)
      if (inlineAnnotation) {
        this.#annotation = inlineAnnotation
      }
    }
  }

  get isLoaded() {
    return Boolean(this.#annotation)
  }

  get annotation() {
    return JSON.parse(this.#annotation)
  }

  get isRemote() {
    return Boolean(this.#sourceURL)
  }

  get URL() {
    return this.#sourceURL
  }

  #deconstructInlineAnnotation(element) {
    // Use textContent instead of innerText,
    // to read consecutive whitespace in inline annotations without collapsing.
    const inlineAnnotation = element.textContent
    element.innerHTML = ''
    return inlineAnnotation
  }
}
