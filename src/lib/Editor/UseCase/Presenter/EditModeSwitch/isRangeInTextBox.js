export default function (textBoxHTMLElement) {
  const selection = window.getSelection()
  return (
    selection.type === 'Range' &&
    textBoxHTMLElement.contains(selection.anchorNode) &&
    textBoxHTMLElement.contains(selection.focusNode)
  )
}
