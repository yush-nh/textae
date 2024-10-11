import PromiseDialog from '../PromiseDialog'
import searchTerm from '../searchTerm'
import setSourceOfAutoComplete from '../setSourceOfAutoComplete'
import template from './template'

export default class TypeDefinitionDialog extends PromiseDialog {
  constructor(
    title,
    content,
    definitionContainer,
    autocompletionWs,
    convertToResultsFunc
  ) {
    super(title, template(content), {}, () => {
      const inputs = super.el.querySelectorAll('input')
      return convertToResultsFunc(
        inputs[0].value,
        inputs[1].value,
        inputs[2].value,
        inputs[3].checked
      )
    })

    const [idElement, labelElement] = super.el.querySelectorAll('input')
    setSourceOfAutoComplete(
      idElement,
      (term, onResult) =>
        searchTerm(
          autocompletionWs,
          (term) => definitionContainer.findByLabel(term),
          term,
          onResult
        ),
      (id, label) => {
        idElement.value = id
        labelElement.value = label
      }
    )
    setSourceOfAutoComplete(
      labelElement,
      (term, onResult) =>
        searchTerm(
          autocompletionWs,
          (term) => definitionContainer.findByLabel(term),
          term,
          onResult
        ),
      (id, label) => {
        idElement.value = id
        labelElement.value = label
      }
    )
  }
}
