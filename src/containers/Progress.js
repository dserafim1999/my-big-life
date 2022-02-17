import React from 'react'
import { ADJUST_STAGE, PREVIEW_STAGE, ANNOTATE_STAGE } from '../constants'
import { connect } from 'react-redux'
import TrackList from './TrackList'
import SemanticEditor from '../components/SemanticEditor.js'
import { nextStep, previousStep } from '../actions/progress'
import { toggleRemainingTracks } from '../actions/ui'
import Card from './Card'
import ProgressBar from './ProgressBar';

import LeftIcon from '@mui/icons-material/ChevronLeft'
import RightIcon from '@mui/icons-material/ChevronRight'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import CheckIcon from '@mui/icons-material/Check'

let Progress = ({ dispatch, stage, canProceed, remaining, showList }) => {
  let Pane
  switch (stage) {
    case ADJUST_STAGE:
    case PREVIEW_STAGE:
      Pane = TrackList
      break
    case ANNOTATE_STAGE:
      Pane = SemanticEditor
      break
  }

  const onPrevious = () => dispatch(previousStep())
  const onNext = () => dispatch(nextStep())

  const remainingMessage = (n) => {
    switch (n) {
      case 0:
        return (
          <span>
            <CheckIcon /> All tracks are processed
          </span>
        )
      case 1:
        return (
          <span>
            <MoreVertIcon /> One track left
          </span>
        )
      default:
        return (
          <span>
            <MoreHorizIcon /> { n } tracks left
          </span>
        )
    }
  }

  let toShow
  if (showList) {
    toShow = (
      <ul className='is-flexgrow slide-from-top-fade-in' style={{ overflowY: 'auto' }}>
        {
          remaining.map((track) => {
            return (
              <li>
                { track.get('name') }
              </li>
            )
          })
        }
      </ul>
    )
  } else {
    toShow = (
      <div className='is-flexgrow' style={{ overflowY: 'auto' }} >
        <Pane className='is-flexgrow' />
      </div>
    )
  }
  return (
    <>
      <Card width="400" height="" top="99" left="99" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <ProgressBar />
        { toShow }
        <div style={{ marginTop: '0.5rem' }}>
          <div className="columns" style={{textAlign: 'center'}}>
            <div className='column'>
              <a className={'button is-warning' + ((stage === 0) ? ' is-disabled' : '')} onClick={onPrevious}>
                <LeftIcon/>
                Previous
              </a>
            </div>
            <div className='column'>
              <a className={'button is-success' + (!canProceed ? ' is-disabled' : '')} onClick={onNext}>
                Continue              
                <RightIcon/>
              </a>
            </div>
          </div>
          <div style={{ color: 'gray', textAlign: 'center', fontSize: '0.9rem' }} className='clickable' onClick={() => dispatch(toggleRemainingTracks())}>
            { remainingMessage(remaining.count()) }
          </div>
        </div>
      </Card>
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    stage: state.get('progress').get('step'),
    showList: state.get('ui').get('showRemainingTracks'),
    remaining: state.get('progress').get('remainingTracks'),
    canProceed: state.get('tracks').get('tracks').count() > 0
  }
}

Progress = connect(mapStateToProps)(Progress)

export default Progress
