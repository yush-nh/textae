import isTouchable from '../../../isTouchable'
import { definition } from './definition'
import isAndroid from '../../../isAndroid'
import { MODE } from '../../../../MODE'

function isIOS() {
  // iPad Safari (iPadOS 14 or later) does not include the string iPad in its userAgent.
  // see https://iwb.jp/ipad-safari-javascript-useragent-is-not-ipad/
  return (
    /iPad/.test(navigator.userAgent) ||
    /iPhone/.test(navigator.userAgent) ||
    (/Macintosh/.test(navigator.userAgent) && isTouchable())
  )
}

class Section {
  #usage
  #buttonList

  constructor(usage, buttonList) {
    this.#usage = usage
    this.#buttonList = buttonList
  }

  isShowOnControlBar() {
    if (isAndroid() || isIOS()) {
      return this.#usage['touch device'].includes('control bar')
    } else {
      return this.#usage['keyboard device'].includes('control bar')
    }
  }

  isShowOnContextMenu() {
    if (isTouchable()) {
      return this.#usage['touch device'].includes('context menu')
    } else {
      return this.#usage['keyboard device'].includes('context menu')
    }
  }

  getButtonsFor(mode) {
    const buttonList = this.#buttonList.filter(({ availableModes }) => {
      console.log('availableModes:', availableModes, mode)
      return availableModes.includes(mode)
    })

    return new Section(this.#usage, buttonList)
  }

  get buttonList() {
    return this.#buttonList
  }

  get displayProperties() {
    return { list: this.#buttonList.map((button) => button.displayProperties) }
  }
}

class Button {
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

export default class Buttons {
  #sections

  constructor() {
    this.#sections = definition.map(({ usage, list }) => {
      return new Section(
        usage,
        list.map(
          ({ type, title, push, enableWhenSelecting, availableModes }) => {
            return new Button(
              type,
              title,
              push,
              enableWhenSelecting,
              availableModes
            )
          }
        )
      )
    })
  }

  // Buttons to display on the control bar.
  get controlBar() {
    return this.#sections
      .filter((section) => section.isShowOnControlBar())
      .map((section) => section.displayProperties)
  }

  // Buttons to display on the context menu.
  getContextMenuFor(mode) {
    return this.#sections
      .filter((section) => section.isShowOnContextMenu())
      .map((section) => section.getButtonsFor(mode))
      .map((section) => section.displayProperties)
  }

  get pasteButton() {
    return this.#buttonList.find(({ type }) => type === 'paste')
  }

  get enableButtonsWhenSelecting() {
    return this.#buttonList.filter((b) => b.enableWhenSelecting)
  }

  get pushButtons() {
    return this.#buttonList.filter((b) => b.push).map((b) => b.type)
  }

  get #buttonList() {
    return this.#sections.flatMap((section) => section.buttonList)
  }
}
