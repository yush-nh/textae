import isURI from '../../../../isURI'
import getAreaIn from './getAreaIn'

export default class StatusBar {
  #editorHTMLElement
  #isShow

  constructor(editorHTMLElement, isShow) {
    this.#editorHTMLElement = editorHTMLElement
    this.#isShow = isShow
  }

  set status(dataSource) {
    if (!this.#isShow) {
      return
    }

    const message = dataSource.displayName

    if (message !== '') {
      getAreaIn(this.#editorHTMLElement).innerHTML = isURI(message)
        ? `Source: ${`<a class="textae-editor__footer__message__link" href="${message}">${decodeURI(
            message
          )}</a>`}`
        : `Source: ${message}`
    }
  }
}
