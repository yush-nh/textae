export default function (annotationModel) {
  return annotationModel.relationInstanceContainer.all.map((r) => {
    return {
      id: r.id,
      pred: r.typeName,
      subj: r.subj,
      obj: r.obj
    }
  })
}
