import delegate from 'delegate'
import alertify from 'alertifyjs'
import enableHTMLElement from '../../enableHTMLElement'
import downloadAnnotationFile from './downloadAnnotationFile'
import viewSource from './viewSource'

export default function (
  eventEmitter,
  element,
  data,
  closeDialog,
  saveAnnotation,
  getFormat
) {
  // Disabled the button to save to the URL when no URL.
  delegate(element, '.textae-editor__save-dialog__url-text', 'input', (e) => {
    enableHTMLElement(e.target.nextElementSibling, e.target.value)
  })

  // Save to the URL.
  delegate(element, '.textae-editor__save-dialog__url-text', 'keyup', (e) => {
    if (e.keyCode === 13) {
      const format = getFormat()
      saveAnnotation(e.target.value, format)
      closeDialog()
    }
  })
  delegate(element, '.textae-editor__save-dialog__url-button', 'click', (e) => {
    const format = getFormat()
    saveAnnotation(e.target.previousElementSibling.value, format)
    closeDialog()
  })

  // Download as a JSON file.
  delegate(
    element,
    '.textae-editor__save-dialog__download-link',
    'click',
    async (e) => {
      const format = getFormat()

      try {
        await downloadAnnotationFile(e, data, format, eventEmitter)
      } catch (error) {
        alertify.error(`Failed to download the source as ${format} format.`)
      } finally {
        closeDialog()
      }
    }
  )

  delegate(
    element,
    '.textae-editor__save-dialog__viewsource-link',
    'click',
    async () => {
      const format = getFormat()

      try {
        await viewSource(data, format, eventEmitter)
      } catch (error) {
        alertify.error(`Failed to view the source as ${format} format.`)
      } finally {
        closeDialog()
      }
    }
  )
}
