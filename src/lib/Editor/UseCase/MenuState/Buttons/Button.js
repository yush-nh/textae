import { MODE } from '../../../../MODE'

export default class Button {
  #type
  #title
  #push = false
  #enableWhenSelecting = null
  #availableModes = [
    MODE.VIEW,
    MODE.EDIT_DENOTATION,
    MODE.EDIT_BLOCK,
    MODE.EDIT_RELATION,
    MODE.EDIT_TEXT
  ]

  constructor(
    type,
    title,
    push = false,
    enableWhenSelecting = null,
    availableModes = null
  ) {
    this.#type = type
    this.#title = title
    this.#push = push
    if (enableWhenSelecting) {
      this.#enableWhenSelecting = enableWhenSelecting
    }
    if (availableModes) {
      this.#availableModes = availableModes
    }
  }

  get displayProperties() {
    return {
      type: this.#type,
      title: this.#title
    }
  }

  get type() {
    return this.#type
  }

  get push() {
    return this.#push
  }

  get enableWhenSelecting() {
    return this.#enableWhenSelecting
  }

  get availableModes() {
    return this.#availableModes
  }
}
