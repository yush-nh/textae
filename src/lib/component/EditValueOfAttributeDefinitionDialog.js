import PromiseDialog from './PromiseDialog'
import getInputElementValue from './getInputElementValue'
import IntervalNotation from '../IntervalNotation'

function template(context) {
  const {
    labelForRangeOrIdOrPattern,
    rangeOrIdOrPattern,
    showDefault,
    default: _default,
    label,
    color
  } = context

  return `
<div class="textae-editor__add-value-to-attribute-dialog__container">
  <div class="textae-editor__add-value-to-attribute-dialog__row">
    <div class="textae-editor__add-value-to-attribute-dialog__range_or_id_or_pattern textae-editor__promise-daialog__observable-element">
      <label>${labelForRangeOrIdOrPattern}:</label><br>
      <input value="${rangeOrIdOrPattern || ''}">
    </div>
    ${
      showDefault
        ? `
    <div class="textae-editor__add-value-to-attribute-dialog__default">
      <label>default:</label><br>
      <input type="checkbox" ${_default ? `checked="checked"` : ``}>
    </div>
    `
        : ``
    }
    <div class="textae-editor__add-value-to-attribute-dialog__label">
      <label>label:</label><br>
      <input value="${label || ''}">
    </div>
    <div class="textae-editor__add-value-to-attribute-dialog__color">
      <label>color:</label><br>
      <input value="${color || ''}">
    </div>
  </div>
</div>`
}

export default class EditValueOfAttributeDefinitionDialog extends PromiseDialog {
  constructor(valueType, value = {}) {
    const bindingObject = {
      label: value.label,
      color: value.color
    }

    switch (valueType) {
      case 'numeric':
        bindingObject.labelForRangeOrIdOrPattern = 'range'
        bindingObject.rangeOrIdOrPattern = value.range
        break
      case 'selection':
        bindingObject.labelForRangeOrIdOrPattern = 'id'
        bindingObject.rangeOrIdOrPattern = value.id
        bindingObject.showDefault = true
        bindingObject.default = value.default
        break
      case 'string':
        bindingObject.labelForRangeOrIdOrPattern = 'pattern'
        bindingObject.rangeOrIdOrPattern = value.pattern
        break
      default:
        throw new Error(`${valueType} is Uknown Attribute`)
    }

    super('Please enter new values', template(bindingObject), {}, () => {
      const rangeOrIdOrPattern = getInputElementValue(
        super.el,
        '.textae-editor__add-value-to-attribute-dialog__range_or_id_or_pattern'
      )

      const label = getInputElementValue(
        super.el,
        '.textae-editor__add-value-to-attribute-dialog__label'
      )

      const color = getInputElementValue(
        super.el,
        '.textae-editor__add-value-to-attribute-dialog__color'
      )

      // Set a key only when there is a value.
      const ret = {}
      if (label) {
        ret.label = label
      }
      if (color) {
        ret.color = color
      }

      switch (valueType) {
        case 'numeric':
          ret.range = rangeOrIdOrPattern
          break
        case 'selection':
          ret.id = rangeOrIdOrPattern
          ret.default = super.el.querySelector(
            '.textae-editor__add-value-to-attribute-dialog__default input'
          ).checked
          break
        case 'string':
          ret.pattern = rangeOrIdOrPattern
          break
        default:
        // A value type is checked already.
      }

      return ret
    })

    // validation range
    if (valueType === 'numeric') {
      super.el
        .querySelector(
          '.textae-editor__add-value-to-attribute-dialog__range_or_id_or_pattern'
        )
        .addEventListener('input', (e) => {
          const value = e.target.value
          try {
            new IntervalNotation(value)
            super.button.removeAttribute('disabled')
          } catch (error) {
            super.button.setAttribute('disabled', 'disabled')
          }
        })
    }

    // validation pattern
    if (valueType === 'string') {
      super.el
        .querySelector(
          '.textae-editor__add-value-to-attribute-dialog__range_or_id_or_pattern'
        )
        .addEventListener('input', (e) => {
          const value = e.target.value
          try {
            new RegExp(value)
            super.button.removeAttribute('disabled')
          } catch (error) {
            super.button.setAttribute('disabled', 'disabled')
          }
        })
    }

    // validation color
    super.el
      .querySelector('.textae-editor__add-value-to-attribute-dialog__color')
      .addEventListener('input', (e) => {
        const value = e.target.value
        if (!value || /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)) {
          super.button.removeAttribute('disabled')
        } else {
          super.button.setAttribute('disabled', 'disabled')
        }
      })
  }
}
