import delegate from 'delegate'
import Dialog from '../Dialog'
import createContentHtml from './createContentHtml'
import reflectImmediately from './reflectImmediately'
import packageJson from '../../../../package.json'

export default class SettingDialog extends Dialog {
  constructor(editor, typeDefinition, entityGap, view) {
    const contentHtml = createContentHtml({
      typeGapDisabled: !entityGap.show,
      typeGap: entityGap.value,
      lineHeight: view.getLineHeight(),
      typeDefinitionLocked: typeDefinition.isLock,
      version: packageJson.version
    })

    super('Setting', contentHtml, {
      label: 'OK'
    })

    // Reflects configuration changes in real time.
    reflectImmediately(super.el, editor, entityGap, typeDefinition, view)

    // Observe enter key press
    delegate(super.el, `.textae-editor--dialog`, 'keyup', (e) => {
      if (e.keyCode === 13) {
        super.close()
      }
    })
  }
}
