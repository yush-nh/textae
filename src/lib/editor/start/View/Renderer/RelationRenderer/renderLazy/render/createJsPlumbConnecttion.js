import $ from 'jquery'
import determineCurviness from '../../determineCurviness'
import getEntityEndopointDom from '../../../../getEntityEndopointDom'
import connectorStrokeStyle from '../../connectorStrokeStyle'
import toLabelString from '../../toLabelString'
import arrowConfig from './arrowConfig'

// Make a connect by jsPlumb.
export default function(
  jsPlumbInstance,
  editor,
  relation,
  annotationData,
  typeDefinition
) {
  const sourceEndpoint = getEntityEndopointDom(editor, relation.subj)
  const targetEndpoint = getEntityEndopointDom(editor, relation.obj)

  return jsPlumbInstance.connect({
    source: $(sourceEndpoint),
    target: $(targetEndpoint),
    anchors: ['TopCenter', 'TopCenter'],
    connector: [
      'Bezier',
      {
        curviness: determineCurviness(sourceEndpoint, targetEndpoint)
      }
    ],
    paintStyle: connectorStrokeStyle(
      annotationData,
      typeDefinition,
      relation.id
    ),
    parameters: {
      id: relation.id
    },
    cssClass: 'textae-editor__relation',
    overlays: [
      ['Arrow', arrowConfig.normal],
      [
        'Label',
        {
          id: 'textae-relation-label',
          label: toLabelString(relation, annotationData, typeDefinition),
          cssClass: 'textae-editor__relation__label'
        }
      ]
    ]
  })
}
