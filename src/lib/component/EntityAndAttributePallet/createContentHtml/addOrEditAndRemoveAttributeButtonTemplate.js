import { getAddAttributeButton } from './getAddAttributeButton'
import { getRemoveAttributeButton } from './getRemoveAttributeButton'

export function addOrEditAndRemoveAttributeButtonTemplate(
  isEntityWithSamePredSelected
) {
  return isEntityWithSamePredSelected
    ? `
  <button
    type="button"
    class="textae-editor__type-pallet__edit-object"
    >Edit object of selected entity</button>
  ${getRemoveAttributeButton()}
  `
    : getAddAttributeButton()
}
