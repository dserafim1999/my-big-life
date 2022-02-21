import React from 'react'
import { ADJUST_STAGE, PREVIEW_STAGE, ANNOTATE_STAGE } from '../constants'
import { connect } from 'react-redux'
import TrackList from './TrackList'
import SemanticEditor from '../components/SemanticEditor.js'
import { nextStep, previousStep } from '../actions/progress'
import { toggleRemainingTracks, addAlert } from '../actions/ui'
import Card from './Card'
import ProgressBar from './ProgressBar';
import AsyncButton from '../components/AsyncButton';

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

  const errorHandler = (err, modifier) => {
    dispatch(addAlert(
      <div>
        <div>There was an error</div>
        <div>{ process.env.NODE_ENV === 'development' ? err.stack.split('\n').map((e) => <div>{e}</div>) : '' }</div>
      </div>
    ), 'error', 20)
    console.error(err.stack)
    modifier('is-danger')
    setTimeout(() => modifier(), 2000)
  }

  const onPrevious = (e, modifier) => {
    modifier('is-loading')
    dispatch(previousStep())
      .then(() => modifier())
      .catch((e) => errorHandler(e, modifier));
  }

  const onNext = (e, modifier) => {
    console.log(e)
    console.log(modifier)
    modifier('is-loading')
    dispatch(nextStep())
      .then(() => modifier())
      .catch((e) => errorHandler(e, modifier));
  }

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
    let style = { overflowY: 'auto' }
    if (stage === ANNOTATE_STAGE) {
      style = {
        ...style,
        overflowX: 'visible',
        resize: 'horizontal',
        paddingTop: '2px',
        maxWidth: '500px',
        minWidth: '110%',
        borderRadius: '0px 3px 3px 0px',
        backgroundColor: 'white'
      }
    }

    toShow = (
      <div className='is-flexgrow' style={{ style }} >
        <Pane className='is-flexgrow' width='100%'/>
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
              <AsyncButton disabled={stage === 0} className={'is-warning'} onClick={onPrevious}>
                <LeftIcon/>
                Previous
              </AsyncButton>
            </div>
            <div className='column'>
              <AsyncButton disabled={!canProceed} className={'is-success'} onClick={onNext}>
                Continue
                <RightIcon/>
              </AsyncButton>
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
