import AttributeDefinition from './AttributeDefinition'
export default class extends AttributeDefinition {
  constructor(hash) {
    super(hash)
    this.autocompletionWs = hash.autocompletion_ws
    this.default = hash.default
    this._values = hash.values || []
  }

  getLabel(obj) {
    const def = this._getDef(obj)

    if (def && def.label) {
      return def.label
    }

    return
  }

  getColor(obj) {
    const def = this._getDef(obj)

    if (def && def.color) {
      return def.color
    }

    return null
  }

  _getDef(obj) {
    const match = this._values
      .filter((a) => a.pattern !== 'default')
      .find((a) => new RegExp(a.pattern).test(obj))

    if (match) {
      return match
    }

    const defaultValue = this._values.find((a) => a.pattern === 'default')
    if (defaultValue) {
      return defaultValue
    }

    return null
  }

  get JSON() {
    return Object.assign(super.JSON, {
      'value type': 'string',
      autocompletion_ws: this.autocompletionWs,
      default: this.default,
      values: this._values
    })
  }
}
