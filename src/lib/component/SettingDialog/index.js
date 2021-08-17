import delegate from 'delegate'
import Dialog from '../Dialog'
import reflectImmediately from './reflectImmediately'
import packageJson from '../../../../package.json'

function template(context) {
  const {
    typeGap,
    typeGapDisabled,
    lineHeight,
    typeDefinitionLocked,
    version
  } = context

  return `
<div class="textae-editor__setting-dialog__container">
  <div class="textae-editor__setting-dialog__row">
    <label>Type Gap</label>
    <input 
      type="number" 
      class="textae-editor__setting-dialog__type-gap-text" 
      step="1" 
      min="0" 
      max="5" 
      value="${typeGap}" ${typeGapDisabled ? `disabled="disabled"` : ''}>
  </div>
  <div class="textae-editor__setting-dialog__row">
    <label>Line Height(px)</label>
    <input 
      type="number" class="textae-editor__setting-dialog__line-height-text" 
      step="1" 
      min="50" 
      max="500" 
      value="${lineHeight}">
  </div>
  <div class="textae-editor__setting-dialog__row">
    <label>
      <input 
        type="checkbox" 
        class="textae-editor__setting-dialog__lock-config-text"
        ${typeDefinitionLocked ? `checked="checked"` : ''}>
      Lock Edit Config
    </label>
  </div>
  <div class="textae-editor__setting-dialog__row">
    <label>Version ${version}</label>
  </div>
</div>
`
}

export default class SettingDialog extends Dialog {
  constructor(typeDefinition, typeGap, textBox) {
    const contentHtml = template({
      typeGapDisabled: !typeGap.show,
      typeGap: typeGap.value,
      lineHeight: textBox.lineHeight,
      typeDefinitionLocked: typeDefinition.isLock,
      version: packageJson.version
    })

    super('Setting', contentHtml, 'OK')

    // Reflects configuration changes in real time.
    reflectImmediately(super.el, typeGap, typeDefinition, textBox)

    // Observe enter key press
    delegate(super.el, `.textae-editor__dialog`, 'keyup', (e) => {
      if (e.keyCode === 13) {
        super.close()
      }
    })
  }
}
