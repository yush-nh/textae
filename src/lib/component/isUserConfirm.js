export default function isUserConfirm(hasChange) {
  const CONFIRM_DISCARD_CHANGE_MESSAGE =
    'There is a change that has not been saved. If you proceed now, you will lose it.'

  return !hasChange || window.confirm(CONFIRM_DISCARD_CHANGE_MESSAGE)
}
