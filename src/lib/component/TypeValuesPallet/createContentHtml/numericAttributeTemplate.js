import headerTemplate from './headerTemplate'
import valueButtonsTemplate from './valueButtonsTemplate'
import showAddAttributeValueButton from './showAddAttributeValueButton'
import predicateControllerTemplate from './predicateControllerTemplate'
import anemone from '../../anemone'

export default function (context) {
  const { min, max, step, default: defaultValue, values } = context.attrDef
  const { isLock } = context

  return anemone`
  ${headerTemplate(context)}
  <div>
    <div class="textae-editor__pallet__predicate">
      ${predicateControllerTemplate(context)}
      min: ${min || '""'}
      max: ${max || '""'}
      step: ${step}
      default: ${defaultValue}
    </div>

    <table>
      <thead>
        <tr>
          <th>range</th>
          <th>label</th>
          <th>color</th>
          ${showAddAttributeValueButton(isLock)}
        </tr>
      </thead>
      <tbody>
        ${values.map(({ color = '', range, label = '', indelible }, index) =>
          toBodyRow(color, range, label, isLock, index, indelible)
        )}
      </tbody>
    </table>
  </div>
  `
}
function toBodyRow(color, range, label, isLock, index, indelible) {
  return () => anemone`
    <tr class="textae-editor__pallet__row" style="background-color: ${color};">
      <td class="textae-editor__pallet__attribute-label">
        ${range}
      </td>
      <td class="textae-editor__pallet__short-label">
        ${label}
      </td>
      <td class="textae-editor__pallet__short-label">
        ${color}
      </td>
      ${() => valueButtonsTemplate(isLock, index, indelible)}
    </tr>
  `
}
