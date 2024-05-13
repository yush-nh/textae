export default function (sourceType, source) {
  switch (sourceType) {
    case 'url':
      return new URL(source, location.href).href
    case 'local file':
      return `${source}(local file)`
    default:
      return `${sourceType}`
  }
}
