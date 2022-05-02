import getSaveToUrl from './getSaveToUrl'

class AnnotationParameter {
  constructor(element) {
    this._map = new Map()

    // Read Html text and clear it.
    // Use textContent instead of innerText,
    // to read consecutive whitespace in inline annotations without collapsing.
    const inlineAnnotation = element.textContent
    element.innerHTML = ''
    if (inlineAnnotation) {
      this._inlineAnnotation = inlineAnnotation
    }
  }

  has(key) {
    return this._map.has(key)
  }

  get(key) {
    return this._map.get(key)
  }

  set(key, value) {
    this._map.set(key, value)
  }

  get hasInlineAnnotation() {
    return Boolean(this._inlineAnnotation)
  }

  get inlineAnnotation() {
    return this._inlineAnnotation
  }
}

export default function (element, source) {
  const annotation = new AnnotationParameter(element)

  // Read url.
  if (source) {
    annotation.set('url', decodeURIComponent(source))
  }

  // Read save_to
  const saveTo = getSaveToUrl(element)
  if (saveTo) {
    annotation.set('save_to', getSaveToUrl(element))
  }

  return annotation
}
