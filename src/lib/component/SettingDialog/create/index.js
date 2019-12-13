import dohtml from 'dohtml'

const html = `
  <div class="textae-editor__setting-dialog">
      <div>
          <label class="textae-editor__setting-dialog__label">Type Gap</label>
          <input type="number" class="textae-editor__setting-dialog__type-gap type-gap" step="1" min="0" max="5">
      </div>
      <div>
          <label class="textae-editor__setting-dialog__label">Line Height</label>
          <input type="number" class="textae-editor__setting-dialog__line-height line-height" step="1" min="50" max="500">
          px
      </div>
      <div>
          <label class="textae-editor__setting-dialog__label">Lock Edit Config</label>
          <input type="checkbox" class="textae-editor__setting-dialog__lock-config lock-config">
      </div>
      <div>
            <label class="textae-editor__setting-dialog__label">Reset Hidden Message Boxes</label>
          <input type="button" class="textae-editor__setting-dialog__reset-hidden-message-boxes reset-hidden-message-boxes" value="Reset">
      </div>
  </div>
`

export default function() {
  return dohtml.create(html)
}
