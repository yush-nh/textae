export default class EditMode {
  // Interface methods
  createSpanWithTouchDevice() {}
  expandSpanWithTouchDevice() {}
  shrinkSpanWithTouchDevice() {}
  editProperties() {}
  relationClicked() {}
  relationBollardClicked(entity) {
    entity.focus()
  }
  applyTextSelectionWithTouchDevice() {}
  manipulateAttribute() {}
  hidePallet() {}
  get isPalletShown() {
    return false
  }
}
