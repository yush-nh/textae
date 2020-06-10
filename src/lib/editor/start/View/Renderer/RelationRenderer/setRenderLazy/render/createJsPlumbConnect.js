import $ from 'jquery'
import determineCurviness from '../../determineCurviness'
import getEntityDom from '../../../../../getEntityDom'
import LABEL from '../../../../../LABEL'
import connectorStrokeStyle from '../../connectorStrokeStyle'
import NORMAL_ARROW from '../../jsPlumbArrowOverlayUtil/NORMAL_ARROW'
import getLabelTag from '../../../getLabelTag'

// Make a connect by jsPlumb.
export default function(
  jsPlumbInstance,
  editor,
  relation,
  annotationData,
  typeDefinition
) {
  return jsPlumbInstance.connect({
    source: $(getEntityDom(editor[0], relation.subj)),
    target: $(getEntityDom(editor[0], relation.obj)),
    anchors: ['TopCenter', 'TopCenter'],
    connector: [
      'Bezier',
      {
        curviness: determineCurviness(editor, annotationData, relation)
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
      ['Arrow', NORMAL_ARROW],
      [
        'Label',
        Object.assign({}, LABEL, {
          label: `[${relation.id}] ${getLabelTag(
            annotationData.namespace,
            typeDefinition.relation,
            relation.type.name
          )}`,
          cssClass: `${LABEL.cssClass}`
        })
      ]
    ]
  })
}
