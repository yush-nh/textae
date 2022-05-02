import AnnotationParameter from './AnnotationParameter'

export default class ParamsFormHTMLElement {
  constructor(element) {
    this._element = element

    this._annotationParameter = new AnnotationParameter(
      this._element,
      this._source
    )

    if (this._element.getAttribute('control')) {
      const controlParam = this._element.getAttribute('control')

      if (controlParam === 'hidden') {
        this._element.classList.add('textae-editor--control-hidden')
      }

      if (controlParam === 'visible') {
        this._element.classList.add('textae-editor--control-visible')
      }

      if (this.mode === 'view' && controlParam !== 'visible') {
        this._element.classList.add('textae-editor--control-hidden')
      }
    }
  }

  get annotation() {
    return this._annotationParameter
  }

  get autocompletionWS() {
    return this._readURLAttribute('autocompletion_ws')
  }

  get config() {
    return this._readURLAttribute('config')
  }

  get configLock() {
    // Over write editor-div's config lock state by url's.
    // Url's default is 'unlock', so its default is also 'unlock'.
    if (this._source) {
      const searchParams = new URLSearchParams(this._source.split('?')[1])

      if (searchParams.has('config_lock')) {
        return searchParams.get('config_lock')
      }
    }

    return this._element.getAttribute('config_lock')
  }

  get mode() {
    return this._element.getAttribute('mode')
  }

  get statusBar() {
    return this._element.getAttribute('status_bar')
  }

  get saveTo() {
    return this._readURLAttribute('save_to')
  }

  get _source() {
    return (
      this._element.getAttribute('source') ||
      this._element.getAttribute('target')
    )
  }

  _readURLAttribute(name) {
    if (this._element.hasAttribute(name)) {
      return decodeURIComponent(this._element.getAttribute(name))
    }

    return null
  }
}
