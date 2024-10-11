import $ from 'jquery'
import searchTerm from './searchTerm'
import customizeJqueryUiAutocomplete from './customize-jquery-ui-autocomplete'

customizeJqueryUiAutocomplete()

export default function setSourceOfAutoComplete(
  inputElement,
  labelElement,
  autocompletionWs,
  getLocalData
) {
  $(inputElement).autocomplete({
    source: (request, response) => {
      if (labelElement instanceof HTMLInputElement) {
        labelElement.value = ''
      } else {
        labelElement.innerText = ''
      }

      searchTerm(
        autocompletionWs,
        getLocalData(request.term),
        request.term,
        response
      )
    },
    minLength: 3,
    select: (_, { item }) => {
      inputElement.value = item.id

      if (labelElement instanceof HTMLInputElement) {
        labelElement.value = item.label
      } else if (labelElement instanceof HTMLSpanElement) {
        labelElement.innerText = item.label
      }

      return false
    }
  })
}
