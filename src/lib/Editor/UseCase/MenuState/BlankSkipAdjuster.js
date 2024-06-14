import skipBlank from './skipBlank'
import TextSelectionAdjuster from './SpanAdjuster'

export default class BlankSkipAdjuster extends TextSelectionAdjuster {
  backFromBegin(str, position, spanConfig) {
    return skipBlank.forward(str, position, (char) =>
      spanConfig.isBlankCharacter(char)
    )
  }

  forwardFromEnd(str, position, spanConfig) {
    return skipBlank.back(str, position, (char) =>
      spanConfig.isBlankCharacter(char)
    )
  }

  forwardFromBegin(str, position, spanConfig) {
    return skipBlank.forward(str, position, (char) =>
      spanConfig.isBlankCharacter(char)
    )
  }

  backFromEnd(str, position, spanConfig) {
    return skipBlank.back(str, position, (char) =>
      spanConfig.isBlankCharacter(char)
    )
  }
}
