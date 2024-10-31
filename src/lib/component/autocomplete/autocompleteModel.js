export default class AutocompleteModel {
  #onTermChange
  #onItemsChange
  #onHighlightIndexChange
  #term = ''
  #items = []
  #highlightedIndex = -1

  constructor(onTermChange, onItemsChange, onHighlightIndexChange) {
    this.#onTermChange = onTermChange
    this.#onItemsChange = onItemsChange
    this.#onHighlightIndexChange = onHighlightIndexChange
  }

  get term() {
    return this.#term
  }

  set term(value) {
    this.#term = value

    if (this.#term.length >= 3) {
      this.#onTermChange(this.#term)
    } else {
      this.clearItems()
    }
  }

  get itemsCount() {
    return this.#items.length
  }

  get hasItems() {
    return this.#items.length > 0
  }

  get hasNoItems() {
    return this.#items.length === 0
  }

  set items(value) {
    this.#items = value
    this.#highlightedIndex = -1 // Clear highlight.
    this.#onItemsChange(this.#items)
  }

  get highlightedIndex() {
    return this.#highlightedIndex
  }

  set highlightedIndex(value) {
    this.#highlightedIndex = value
    this.#onHighlightIndexChange(this.#highlightedIndex)
  }

  clearItems() {
    this.items = []
  }

  moveHighlightIndexPrevious() {
    if (this.highlightedIndex >= 0) {
      this.highlightedIndex--
    } else {
      this.highlightedIndex = this.itemsCount - 1
    }
  }

  moveHighlightIndexNext() {
    if (this.highlightedIndex < this.itemsCount - 1) {
      this.highlightedIndex++
    } else {
      this.highlightedIndex = -1
    }
  }
}
