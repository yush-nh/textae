import delegate from 'delegate'
import PromiseDialog from '../PromiseDialog'
import getValues from './getValues'
import Autocomplete from '../autocomplete'
import createContentHTML from './createContentHTML'
import SelectionAttributePallet from '../SelectionAttributePallet'
import EditNumericAttributeDialog from '../EditNumericAttributeDialog'
import EditStringAttributeDialog from '../EditStringAttributeDialog'
import mergedTypeValuesOf from './mergedTypeValuesOf'
import searchTerm from '../searchTerm'

export default class EditPropertiesDialog extends PromiseDialog {
  constructor(
    editorHTMLElement,
    annotationType,
    palletName,
    definitionContainer,
    attributeContainer,
    autocompletionWs,
    selectedItems,
    typeValuesPallet,
    mousePoint
  ) {
    const { typeName, attributes } = mergedTypeValuesOf(selectedItems)
    const typeLabel = definitionContainer.getLabel(typeName)
    const contentHtml = createContentHTML(
      typeName,
      typeLabel,
      attributes,
      attributeContainer,
      palletName
    )

    super(
      `${annotationType} [${selectedItems
        .map(({ id }) => id)
        .join(',')}] Properties`,
      contentHtml,
      {
        maxWidth: 800
      },
      () => getValues(super.el)
    )

    const updateDisplay = (typeName, label, attributes) => {
      this.#updateDisplay(
        attributeContainer,
        definitionContainer,
        autocompletionWs,
        typeName,
        label,
        attributes
      )
    }

    const element = super.el
    const onEditAttributeClick = (e) => {
      const { pred } = e.target.dataset
      const attrDef = attributeContainer.get(pred)
      const zIndex = parseInt(
        element.closest('.textae-editor__dialog').style['z-index']
      )
      const { typeName, label, attributes } = getValues(element)

      switch (attrDef.valueType) {
        case 'numeric':
          new EditNumericAttributeDialog(
            attrDef,
            attributes[e.target.dataset.index],
            [attributes[e.target.dataset.index]]
          )
            .open()
            .then(({ newObj }) => {
              attributes[e.target.dataset.index].obj = newObj
              updateDisplay(typeName, label, attributes)
            })
          break
        case 'selection':
          new SelectionAttributePallet(editorHTMLElement, mousePoint)
            .show(attrDef, zIndex, e.target)
            .then((newObj) => {
              attributes[e.target.dataset.index].obj = newObj
              updateDisplay(typeName, label, attributes)
            })
          break
        case 'string':
          new EditStringAttributeDialog(
            attrDef,
            attributes[e.target.dataset.index],
            [attributes[e.target.dataset.index]]
          )
            .open()
            .then(({ newObj, newLabel }) => {
              attributes[e.target.dataset.index].obj = newObj
              attributes[e.target.dataset.index].label = newLabel
              updateDisplay(typeName, label, attributes)
            })
          break
        default:
          throw `${attrDef.valueType} is unknown attribute.`
      }
    }

    // Observe edit an attribute button.
    delegate(
      element,
      '.textae-editor__edit-type-values-dialog__edit-attribute',
      'click',
      onEditAttributeClick
    )

    // Observe remove an attribute button.
    delegate(
      element,
      '.textae-editor__edit-type-values-dialog__remove-attribute',
      'click',
      (e) => {
        const { index } = e.target.dataset
        const indexOfAttribute = parseInt(index)
        const { typeName, label, attributes } = getValues(element)
        updateDisplay(
          typeName,
          label,
          attributes.filter((_, i) => i !== indexOfAttribute)
        )
      }
    )

    // Observe open pallet button.
    delegate(
      element,
      '.textae-editor__edit-type-values-dialog__open-pallet',
      'click',
      () => {
        super.close()
        typeValuesPallet.show()
      }
    )

    // Observe add an attribute button.
    delegate(
      element,
      '.textae-editor__edit-type-values-dialog__add-attribute',
      'click',
      (e) => {
        const { pred } = e.target.dataset
        const defaultValue = attributeContainer.get(pred).default

        const { typeName, label, attributes } = getValues(element)
        updateDisplay(
          typeName,
          label,
          attributes
            .concat({ pred, obj: defaultValue, id: '' })
            .sort((a, b) => attributeContainer.attributeCompareFunction(a, b))
        )
      }
    )

    // Setup autocomplete
    this.#setupAutocomplete(autocompletionWs, definitionContainer)
  }

  #setupAutocomplete(autocompletionWs, definitionContainer) {
    const typeNameElement = super.el.querySelector(
      '.textae-editor__edit-type-values-dialog__type-name'
    )
    const typeLabelElement = super.el.querySelector(
      '.textae-editor__edit-type-values-dialog__type-label'
    )
    new Autocomplete(
      typeNameElement,
      (term, onResult) =>
        searchTerm(
          term,
          onResult,
          autocompletionWs,
          definitionContainer.findByLabel(term)
        ),
      (id, label) => {
        typeNameElement.value = id
        typeLabelElement.innerText = label
      }
    )
  }

  #updateDisplay(
    attributeContainer,
    entityContainer,
    autocompletionWs,
    typeName,
    typeLabel,
    attributes
  ) {
    const contentHtml = createContentHTML(
      typeName,
      typeLabel,
      attributes,
      attributeContainer
    )
    super.el.closest('.ui-dialog-content').innerHTML = contentHtml

    this.#setupAutocomplete(autocompletionWs, entityContainer)
  }
}
