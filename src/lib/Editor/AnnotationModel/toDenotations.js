export default function (annotationModel) {
  return annotationModel.entityInstanceContainer.denotations.map((entity) => ({
    id: entity.id,
    span: {
      begin: entity.span.begin,
      end: entity.span.end
    },
    obj: entity.typeName
  }))
}
