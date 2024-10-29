import createResultElement from './createResultElement'

export default class ItemContainer {
  #inputElement
  #element

  constructor(inputElement) {
    this.#inputElement = inputElement
    this.#element = document.createElement('ul')
    this.#element.setAttribute('popover', 'auto')
    this.#element.classList.add('textae-editor__dialog__autocomplete')
    inputElement.parentElement.appendChild(this.#element)
  }

  get element() {
    return this.#element
  }

  set items(items) {
    this.#element.innerHTML = ''

    if (items.length === 0) {
      this.#element.hidePopover()
      return
    }

    const elements = items.map(createResultElement)
    this.#element.append(...elements)
    this.#showPopoverUnderInputElement()
  }

  highlight(index) {
    this.#unhighlight() // Clear previous highlight.

    const currentItem = this.#element.querySelector(
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

    Object.assign(this.#element.style, {
      position: 'absolute',
      top: `${rect.bottom + window.scrollY}px`,
      left: `${rect.left + window.scrollX}px`
    })

    this.#element.showPopover()
  }

  #unhighlight() {
    const target = this.#element.querySelector(
      '.textae-editor__dialog__autocomplete__item--highlighted'
    )

    if (target) {
      target.classList.remove(
        'textae-editor__dialog__autocomplete__item--highlighted'
      )
    }
  }
}
