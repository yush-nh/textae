import { isJsonResponse, isMarkdownResponse } from './responseTypes'
import InlineAnnotationConverter from '../../../InlineAnnotationConverter'

export default async function parseResponse(response, url) {
  if (isJsonResponse(response, url)) {
    return await response.json()
  } else if (isMarkdownResponse(response, url)) {
    const inline_annotation = await response.text()
    return await InlineAnnotationConverter.toJSON(inline_annotation)
  } else {
    throw new Error('The content type of the loaded content is not supported.')
  }
}
