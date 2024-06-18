import bindChangeLockConfig from './bindChangeLockConfig'
import bindChangeLineHeight from './bindChangeLineHeight'
import bindChangeTypeGap from './bindChangeTypeGap'

export default function (content, typeGap, typeDictionary, textBox) {
  bindChangeTypeGap(content, typeGap, textBox)
  bindChangeLineHeight(content, textBox)
  bindChangeLockConfig(content, typeDictionary)
}
