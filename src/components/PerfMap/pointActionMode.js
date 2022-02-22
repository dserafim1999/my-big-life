export default (lseg, current, previous) => {
  const action = current.get('pointAction')
  if (!action) {
    return
  }

  const onClick = action.get('onClick')
  
  lseg.points.on('click', (target) => {
    const index = target.layer.index
    onClick(index, current.get('points').get(index))
  })

  lseg.points.addTo(lseg.details)
  lseg.tearDown = () => {
    lseg.points.off('click')
    lseg.details.removeLayer(lseg.points)
    lseg.tearDown = null
  }
}