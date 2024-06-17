import alertifyjs from 'alertifyjs'
import createNumericAttributeOrShowEditNumericAttributeDialog from './createNumericAttributeOrShowEditNumericAttributeDialog'
import createStringAttributeOrShowEditStringAttributeDialog from './createStringAttributeOrShowEditStringAttributeDialog'

export default class AttributeEditor {
  #commander
  #selectionModelItems
  #selectionAttributePallet
  #typeDefinition
  #editProperties
  #typeValuesPallet

  constructor(
    commander,
    annotationModel,
    selectionModelItems,
    selectionAttributePallet,
    editProperties,
    typeValuesPallet
  ) {
    this.#commander = commander
    this.#selectionModelItems = selectionModelItems
    this.#selectionAttributePallet = selectionAttributePallet
    this.#typeDefinition = annotationModel.typeDefinition
    this.#editProperties = editProperties
    this.#typeValuesPallet = typeValuesPallet
  }

  addOrEditAt(number) {
    this.#selectionAttributePallet.hide()

    const attrDef = this.#typeDefinition.attribute.getAttributeAt(number)

    if (!attrDef) {
      alertifyjs.warning(`Attribute No.${number} is not defined`)
      return
    }

    switch (attrDef.valueType) {
      case 'flag':
        this.#commander.invoke(
          this.#commander.factory.toggleFlagAttributeToItemsCommand(
            this.#selectionModelItems.all,
            attrDef
          )
        )
        break
      case 'numeric':
        createNumericAttributeOrShowEditNumericAttributeDialog(
          this.#selectionModelItems,
          attrDef,
          this.#commander,
          this.#editProperties,
          this.#typeValuesPallet
        )
        break
      case 'selection':
        {
          if (this.#selectionModelItems.selectedWithAttributeOf(attrDef.pred)) {
            this.#selectionAttributePallet.show(attrDef).then((newObj) => {
              if (
                this.#selectionModelItems.isDuplicatedPredAttributeSelected(
                  attrDef.pred
                )
              ) {
                alertifyjs.warning(
                  'An item among the selected has this attribute multiple times.'
                )
              } else {
                const command =
                  this.#commander.factory.changeAttributeObjOfItemsCommand(
                    this.#selectionModelItems.all,
                    attrDef,
                    newObj
                  )
                this.#commander.invoke(command)
              }
            })
          } else {
            const command =
              this.#commander.factory.createAttributeToItemsCommand(
                this.#selectionModelItems.all,
                attrDef
              )
            this.#commander.invoke(command)
          }
        }
        break
      case 'string':
        createStringAttributeOrShowEditStringAttributeDialog(
          this.#selectionModelItems,
          attrDef,
          this.#commander,
          this.#editProperties,
          this.#typeValuesPallet
        )
        break
      default:
        throw `${attrDef.valueType} is unknown attribute`
    }
  }

  deleteAt(number) {
    const attrDef = this.#typeDefinition.attribute.getAttributeAt(number)

    if (!attrDef) {
      alertifyjs.warning(`Attribute No.${number} is not defined`)
      return
    }

    if (this.#selectionModelItems.selectedWithAttributeOf(attrDef.pred)) {
      const command =
        this.#commander.factory.removeAttributesFromItemsByPredCommand(
          this.#selectionModelItems.all,
          attrDef
        )
      this.#commander.invoke(command)
    } else {
      alertifyjs.warning('None of the selected items has this attribute.')
    }
  }
}
