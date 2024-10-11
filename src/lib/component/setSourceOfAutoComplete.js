import $ from 'jquery'
import customizeJqueryUiAutocomplete from './customize-jquery-ui-autocomplete'

customizeJqueryUiAutocomplete()

export default function setSourceOfAutoComplete(
  inputElement,
  searchFunction,
  onSelect
) {
  $(inputElement).autocomplete({
    source: ({ term }, response) => searchFunction(term, response),
    minLength: 3,
    select: (_, { item }) => {
      onSelect(item.id, item.label)
      return false
    }
  })
}
