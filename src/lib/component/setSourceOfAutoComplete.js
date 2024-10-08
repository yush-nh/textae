import $ from 'jquery'
import searchTerm from './searchTerm'
import customizeJqueryUiAutocomplete from './customize-jquery-ui-autocomplete'

customizeJqueryUiAutocomplete()

export default function setSourceOfAutoComplete(
  inputElement,
  labelSpan,
  autocompletionWs,
  getLocalData
) {
  $(inputElement).autocomplete({
    source: (request, response) => {
      if (labelSpan) {
        if (labelSpan instanceof HTMLInputElement) {
          labelSpan.value = ''
        } else {
          labelSpan.innerText = ''
        }
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

      if (labelSpan) {
        if (labelSpan instanceof HTMLInputElement) {
          labelSpan.value = item.label
        } else {
          labelSpan.innerText = item.label
        }
      }

      return false
    }
  })
}
