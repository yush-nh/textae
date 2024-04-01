export default class PushButton {
  #name
  #eventEmitter
  #isPushed

  constructor(name, eventEmitter = null) {
    this.#name = name
    this.#eventEmitter = eventEmitter
    this.#isPushed = false
  }

  get name() {
    return this.#name
  }

  get isPushed() {
    return this.#isPushed
  }

  set isPushed(value) {
    this.#isPushed = value
    this.#propagate()
  }

  toggle() {
    this.#isPushed = !this.#isPushed
    this.#propagate()
  }

  #propagate() {
    if (this.#eventEmitter) {
      this.#eventEmitter.emit('textae-event.control.button.push', this)
    }
  }
}
