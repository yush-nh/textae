export default function getLongestIdMatchType(typeIds) {
  let longestMatchId = ''

  for (const id of typeIds) {
    if (id.length > longestMatchId.length) {
      longestMatchId = id
    }
  }

  return longestMatchId
}
