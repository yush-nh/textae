export const RESOURCE_TYPE = Object.freeze({
  QUERY_PARAMETER: 'parameter', // The annotation data is passed as a query parameter.
  INLINE: 'inline', // The annotation data is written in the HTML.
  REMOTE_URL: 'remote', // The annotation data is set by remote URL.
  INSTANT: 'instant', // The annotation data is set by the data load dialog as json string.
  LOCAL_FILE: 'local file', // The annotation data is set by the data load dialog as a local file.
  UNKNOWN: 'unknown'
})
