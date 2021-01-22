import inputDefault from './inputDefault'
import inputNumeric from './inputNumeric'

export default function (componentClassName, context) {
  const { pred, default: _default, min, max, step, valueType } = context

  const showDefault = valueType === 'numeric' || valueType === 'string'
  const showNumeric = valueType === 'numeric'

  return `
    <div class="${componentClassName}__row">
      <div class="${componentClassName}__pred textae-editor__promise-daialog__observable-element">
        <label>Predicate:</label><br>
        <input value="${pred || ''}">
      </div>
      ${showDefault ? `${inputDefault(componentClassName, _default)}` : ''}
    </div>
    ${showNumeric ? `${inputNumeric(componentClassName, min, max, step)}` : ''}
  `
}
