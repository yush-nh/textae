import TypeValues from '../../TypeValues'
import EntityModel from '../../EntityModel'
import getSelectedEntities from './getSelectedEntities'

export default class Clipboard {
  constructor(
    eventEmitter,
    commander,
    selectionModel,
    denotationDefinitionContainer,
    attributeDefinitionContainer,
    typeDefinition
  ) {
    this._eventEmitter = eventEmitter
    this._commander = commander
    this._selectionModel = selectionModel
    this._denotationDefinitionContainer = denotationDefinitionContainer
    this._attributeDefinitionContainer = attributeDefinitionContainer
    this._typeDefinition = typeDefinition

    // This list stores two types of things: type for copy and entity for cut.
    // Only one type is stored at a time.
    // Use one list.
    this._items = []

    eventEmitter
      .on('textae-event.annotation-data.entity.remove', (entity) => {
        if (this.hasCuttingItem) {
          this._updateItems(this._items.filter((e) => e != entity))
        }
      })
      .on('textae-event.edit-mode.transition', () => this._updateItems())
  }

  get hasCopyingItem() {
    return this._items[0] instanceof TypeValues
  }

  get hasCuttingItem() {
    return this._items[0] instanceof EntityModel
  }

  copyEntitiesToLocalClipboard() {
    // Map entities to types, because entities may be delete.
    this._updateItems(this._copyingItems)
  }

  copyEntitiesToSystemClipboard(clipboardEvent) {
    const copyingItems = this._copyingItems

    if (copyingItems.length > 0) {
      const entityTypes = this._denotationDefinitionContainer.config.filter(
        ({ id }) => copyingItems.some(({ typeName }) => typeName === id)
      )

      const attributeTypes = this._attributeDefinitionContainer.config.filter(
        ({ pred }) =>
          copyingItems.some(({ attributes }) =>
            attributes.some((a) => a.pred === pred)
          )
      )

      const dataString = JSON.stringify({
        typeValues: copyingItems.map(({ JSON }) => JSON),
        config: {
          'entity types': entityTypes,
          'attribute types': attributeTypes
        }
      })

      clipboardEvent.clipboardData.setData('text/plain', dataString)
      clipboardEvent.clipboardData.setData(
        'application/x-textae-type-values',
        dataString
      )
      clipboardEvent.preventDefault()
    }
  }

  cutEntities() {
    const newItems = getSelectedEntities(this._selectionModel)

    //  When exactly the same entities that are being cut are selected, the cut is canceled.
    if (
      this._cuttingItems.length &&
      this._cuttingItems.every((item) => newItems.has(item)) &&
      [...newItems].every((item) => this._cuttingItems.includes(item))
    ) {
      this._updateItems()
    } else {
      this._updateItems([...newItems])
    }
  }

  pasteEntities(clipboardEvent) {
    if (
      this._itemsWillBeCutAndPaste.length &&
      this._selectionModel.span.single
    ) {
      const command = this._commander.factory.moveEntitiesToSelectedSpanCommand(
        this._itemsWillBeCutAndPaste
      )
      this._commander.invoke(command)
      this._updateItems()

      return
    }

    const copyData = clipboardEvent.clipboardData.getData(
      'application/x-textae-type-values'
    )

    if (copyData) {
      const data = JSON.parse(copyData)

      if (this._typeDefinition.isLock) {
        const typeValuesList = data.typeValues.map(
          ({ obj, attributes }) =>
            new TypeValues(
              obj,
              attributes.filter(
                ({ pred }) =>
                  this._attributeDefinitionContainer.get(pred) &&
                  this._attributeDefinitionContainer.get(pred).valueType ===
                    data.config['attribute types'].find((a) => a.pred === pred)[
                      'value type'
                    ]
              )
            )
        )

        const command =
          this._commander.factory.pasteTypesToSelectedSpansCommand(
            typeValuesList,
            [],
            []
          )
        this._commander.invoke(command)
      } else {
        const typeValuesList = data.typeValues.map(
          ({ obj, attributes }) =>
            new TypeValues(
              obj,
              attributes.filter(
                ({ pred }) =>
                  !this._attributeDefinitionContainer.get(pred) ||
                  this._attributeDefinitionContainer.get(pred).valueType ===
                    data.config['attribute types'].find((a) => a.pred === pred)[
                      'value type'
                    ]
              )
            )
        )

        const newTypes = data.config['entity types'].filter(
          ({ id }) =>
            !this._denotationDefinitionContainer.config.some(
              (type) => type.id === id
            )
        )
        const attrDefs = data.config['attribute types'].filter(
          ({ pred }) => !this._attributeDefinitionContainer.get(pred)
        )

        const command =
          this._commander.factory.pasteTypesToSelectedSpansCommand(
            typeValuesList,
            newTypes,
            attrDefs
          )
        this._commander.invoke(command)
      }

      return
    }
  }

  // Notify items that are cutting and items that are no longer cutting
  // in order to switch between highlighting entities that are cutting.
  _updateItems(newItems = []) {
    const oldItems = this._cuttingItems.filter((i) => !newItems.includes(i))
    this._items = newItems

    this._eventEmitter.emit(
      'textae-event.clip-board.change',
      this._cuttingItems,
      oldItems
    )
  }

  // Exclude entities of the selected span.
  // When you cut and paste an entity,
  // the destination of the entity is the selected span.
  // If the destination and source spans are the same,
  // there is no change in the model.
  // In order to cause no change in the command history,
  // if the span of the entity being cut is the same as the span being selected, the entity is not pasted.
  get _itemsWillBeCutAndPaste() {
    return this._cuttingItems.filter(
      (i) =>
        i.span.id !==
        (this._selectionModel.span.single &&
          this._selectionModel.span.single.id)
    )
  }

  get _copyingItems() {
    return [...getSelectedEntities(this._selectionModel)].map(
      ({ typeValues }) => typeValues
    )
  }

  get _cuttingItems() {
    return this.hasCuttingItem ? this._items : []
  }
}
