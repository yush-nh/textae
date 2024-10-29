import createResultElement from './createResultElement'

export default class ItemContainer {
  #inputElement
  #container

  constructor(inputElement) {
    this.#inputElement = inputElement
    this.#container = document.createElement('ul')
    this.#container.setAttribute('popover', 'auto')
    this.#container.classList.add('textae-editor__dialog__autocomplete')
    inputElement.parentElement.appendChild(this.#container)
  }

  get element() {
    return this.#container
  }

  set items(items) {
    if (items.length > 0) {
      this.#container.innerHTML = ''
      const elements = items.map(createResultElement)
      this.#container.append(...elements)
      this.#showPopoverUnderInputElement()
    } else {
      this.#container.hidePopover()
    }
  }

  highlight(index) {
    this.#unhighlight() // Clear previous highlight.

    const currentItem = this.#container.querySelector(
      `li:nth-child(${index + 1})`
    )

    if (currentItem) {
      currentItem.classList.add(
        'textae-editor__dialog__autocomplete__item--highlighted'
      )
    }
  }

  #showPopoverUnderInputElement() {
    const rect = this.#inputElement.getBoundingClientRect()

    Object.assign(this.#container.style, {
      position: 'absolute',
      top: `${rect.bottom + window.scrollY}px`,
      left: `${rect.left + window.scrollX}px`
    })

    this.#container.showPopover()
  }

  #unhighlight() {
    const target = this.#container.querySelector(
      '.textae-editor__dialog__autocomplete__item--highlighted'
    )

    if (target) {
      target.classList.remove(
        'textae-editor__dialog__autocomplete__item--highlighted'
      )
    }
  }
}
