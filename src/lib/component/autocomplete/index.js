import AutocompleteModel from './autocompleteModel'
import debounce300 from '../debounce300'
import delegate from 'delegate'
import ItemContainer from './ItemContainer'

export default class Autocomplete {
  #inputElement
  #onSelect
  #model
  #itemsContainer

  constructor(inputElement, onSearch, onSelect) {
    this.#inputElement = inputElement
    this.#onSelect = onSelect
    this.#itemsContainer = new ItemContainer(inputElement)

    this.#model = new AutocompleteModel(
      (term) => onSearch(term, (results) => (this.#model.items = results)),
      (items) => (this.#itemsContainer.items = items),
      (index) => this.#itemsContainer.highlight(index)
    )

    this.#setEventHandlersToInput(this.#inputElement)
    this.#setEventHandlersToItemsContainer(this.#itemsContainer.element)
  }

  #setEventHandlersToInput(element) {
    const handleInput = debounce300((term) => {
      this.#model.term = term
    })

    element.addEventListener('input', ({ target }) => handleInput(target.value))
    element.addEventListener('keydown', (event) => this.#handleKeydown(event))
    element.addEventListener('keyup', (event) => this.#handleKeyup(event))
  }

  #setEventHandlersToItemsContainer(element) {
    delegate(element, 'li', 'mousedown', ({ delegateTarget }) => {
      this.#onSelect(delegateTarget.dataset.id, delegateTarget.dataset.label)
      element.hidePopover()
    })

    delegate(element, 'li', 'mouseover', ({ delegateTarget }) => {
      this.#model.highlightedIndex = Number(delegateTarget.dataset.index)
    })

    delegate(element, 'li', 'mouseout', () => {
      this.#model.highlightedIndex = -1
    })
  }

  #handleKeydown(event) {
    if (this.#model.itemsCount === 0) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        this.#model.moveHighlightIndexNext()
        break

      case 'ArrowUp':
        event.preventDefault()
        this.#model.moveHighlightIndexPrevious()
        break
    }
  }

  #handleKeyup(event) {
    if (event.key === 'Enter' && this.#model.itemsCount > 0) {
      // Prevent dialog closing event to close only popover by Enter.
      event.stopPropagation()

      const currentItem = document.querySelector(
        '.textae-editor__dialog__autocomplete__item--highlighted'
      )

      if (currentItem) {
        this.#onSelect(currentItem.dataset.id, currentItem.dataset.label)
      }

      this.#model.clearItems()
    }
  }
}
