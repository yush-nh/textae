import getForwardMatchTypes from './getForwardMatchTypes'
import getLongestIdMatchType from './getLongestIdMatchType'

export default function getForwardMatchID(typeIds, id) {
  // '*' at the last char of id means wildcard.
  const forwardMatchTypes = getForwardMatchTypes(typeIds, id)

  if (forwardMatchTypes.length === 0) {
    return null
  }

  // If some wildcard-id are matched, return the id of the most longest matched.
  return getLongestIdMatchType(forwardMatchTypes)
}
