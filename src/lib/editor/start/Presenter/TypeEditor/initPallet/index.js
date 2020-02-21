import CreateTypeDefinitionDialog from '../../../../../component/CreateTypeDefinitionDialog'
import EditTypeDefinitionDialog from '../../../../../component/EditTypeDefinitionDialog'

export default function(
  pallet,
  editor,
  autocompletionWs,
  commander,
  name,
  handler
) {
  editor.eventEmitter
    .on(`textae.${name}Pallet.add-button.click`, () => {
      const dialog = new CreateTypeDefinitionDialog(
        handler.typeContainer,
        autocompletionWs
      )
      dialog.promise.then(({ newType }) =>
        handler.commander.invoke(handler.addType(newType))
      )
      dialog.open()
    })
    .on(`textae.${name}Pallet.read-button.click`, () =>
      editor.api.handlePalletClick('textae.pallet.button.read.click')
    )
    .on(`textae.${name}Pallet.write-button.click`, () =>
      editor.api.handlePalletClick('textae.pallet.button.write.click')
    )
    .on(`textae.${name}Pallet.item.label.click`, (typeName) =>
      commander.invoke(handler.changeTypeOfSelectedElement(typeName))
    )
    .on(`textae.${name}Pallet.item.select-all-button.click`, (typeName) =>
      handler.selectAll(typeName)
    )
    .on(
      `textae.${name}Pallet.item.edit-button.click`,
      (id, color, isDefault) => {
        const dialog = new EditTypeDefinitionDialog(
          handler.typeContainer,
          id,
          color,
          isDefault,
          autocompletionWs
        )
        dialog.promise.then(({ id, changedProperties }) => {
          if (changedProperties.size) {
            handler.commander.invoke(handler.changeType(id, changedProperties))
          }
        })
        dialog.open()
      }
    )
    .on(`textae.${name}Pallet.item.remove-button.click`, (id, label) => {
      // When the user clicks the delete button, the browser focuses on the delete button.
      // If you delete a line that contains a delete button with focus, the editor loses focus.
      // Keyboard shortcuts will not work if focus is lost from the editor.
      // To prevent this, focus on the editor before deleting the line.
      editor.focus()

      commander.invoke(handler.removeType(id, label))
    })
    .on('textae.editor.unselect', () => pallet.hide()) // Close pallet when selecting other editor.
    .on('textae.history.change', () => pallet.updateDisplay()) // Update save config button when changing history and savigng configuration.
    .on('textae.dataAccessObject.configuration.save', () =>
      pallet.updateDisplay()
    )
    .on(`textae.typeDefinition.${name}.type.lock`, () => pallet.updateDisplay())
    .on(`textae.typeDefinition.${name}.type.change`, () =>
      pallet.updateDisplay()
    )
    .on(`textae.typeDefinition.${name}.type.default.change`, () =>
      pallet.updateDisplay()
    )

  editor[0].appendChild(pallet.el)
}
