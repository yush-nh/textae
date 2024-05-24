export default function (menuState, spanConfig) {
  if (menuState.isPushed('boundary detection')) {
    return (char) => spanConfig.isDelimiter(char)
  } else {
    return () => true
  }
}
