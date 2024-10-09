import getUrlMatches from '../../../getUrlMatches'

export default function formatForPallet(
  types,
  countMap,
  definedTypes,
  defaultType,
  defaultColor
) {
  return types.map((id) => ({
    id,
    label: definedTypes.getLabelOf(id) || undefined,
    defaultType: id === defaultType,
    uri: getUrlMatches(id) ? id : undefined,
    color: definedTypes.getColorOf(id) || defaultColor,
    useNumber: countMap.get(id).usage
  }))
}
