import $ from 'jquery'
import searchTerm from './searchTerm'
import customizeJqueryUiAutocomplete from './customize-jquery-ui-autocomplete'

customizeJqueryUiAutocomplete()

export default function setSourceOfAutoComplete(
  inputElement,
  autocompletionWs,
  getLocalData,
  onSelect
) {
  $(inputElement).autocomplete({
    source: ({ term }, response) => {
      searchTerm(autocompletionWs, getLocalData, term, response)
    },
    minLength: 3,
    select: (_, { item }) => {
      onSelect(item.id, item.label)
      return false
    }
  })
}
