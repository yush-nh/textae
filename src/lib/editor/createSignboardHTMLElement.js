import dohtml from 'dohtml'
import toAnchorElement from './toAnchorElement'

export default function (
  title,
  entityType,
  color,
  href,
  displayName,
  attributes,
  cssClass,
  id
) {
  // A Type element has an entity_pane elment that has a label and will have entities.
  const html = `
<div
  class="textae-editor__signboard ${cssClass ? cssClass : ''}"
  ${id ? `id="${id}"` : ''}
  title="${title}"
  data-entity-type="${entityType}"
  data-id="${title}"
  >
  <div
    class="textae-editor__signboard__type-values"
    style="background-color: ${color};"
    >
    <div
      class="textae-editor__signboard__type-label"
      tabindex="0"
      >
      ${toAnchorElement(displayName, href)}
    </div>
    ${attributes.map((a) => a.contentHTML).join('\n')}
  </div>
</div>
`

  return dohtml.create(html)
}
