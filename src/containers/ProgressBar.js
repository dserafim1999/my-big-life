import React from 'react'
import { connect } from 'react-redux'

let ProgressBar = ({ state, children }) => {
  const none = {}
  const active = { className: 'active' }
  const width = '25%'

  return (
    <div className='status-container'>
      <ul className='progressbar'>
        <li { ...(state >= 0 ? active : none) } key={0} style={{width}}>Preview</li>
        <li { ...(state >= 1 ? active : none) } key={1} style={{width}}>Adjust</li>
        <li { ...(state >= 2 ? active : none) } key={2} style={{width}}>Annotate</li>
        <li { ...(state >= 3 ? active : none) } key={3} style={{width}}>Done</li>
      </ul>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    state: state.get('progress').get('step') || 0
  }
}

ProgressBar = connect(mapStateToProps)(ProgressBar)

export default ProgressBar