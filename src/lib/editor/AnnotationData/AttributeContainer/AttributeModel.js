export default class AttributeModel {
  // Expected an attribute like {id: "A1", subj: "T1", pred: "example_predicate_1", obj: "attr1"}.
  constructor({ id, subj, pred, obj }, entityContainer) {
    this.id = id
    this.subj = subj
    this.pred = pred
    this.obj = obj
    this._entityContainer = entityContainer
  }

  get entity() {
    return this._entityContainer.get(this.subj)
  }

  equalsTo(pred, obj) {
    // If the attribute is a numeric type,
    // then the type of obj is numeric.
    // Cast obj to a string to compare.
    return this.pred === pred && String(this.obj) === obj
  }
}
