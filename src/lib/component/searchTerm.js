export default function (autocompletionWs, localData, term, done) {
  if (!autocompletionWs) {
    done(localData)
    return
  }

  const url = new URL(autocompletionWs, location)
  url.searchParams.append('term', term)

  fetch(url.href)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
    })
    .then((data) => {
      // Prior local data if duplicated
      const filteredData = data.filter(
        (newDatum) =>
          !localData.some((localDatum) => newDatum.id === localDatum.id)
      )

      done(localData.concat(filteredData))
    })
}
