import React from 'react'
import { ADJUST_STAGE, PREVIEW_STAGE, ANNOTATE_STAGE } from '../constants'
import { connect } from 'react-redux'
import TrackList from './TrackList'
import SemanticEditor from '../components/SemanticEditor.js'
import { 
  nextStep, 
  previousStep,
  bulkProcess,
  loadLIFE
} from '../actions/progress'  
import { toggleRemainingTracks, addAlert } from '../actions/ui'
import {
  clearAll,
  downloadAll,
  showHideAll
} from '../actions/tracks'

import Card from './Card'
import ProgressBar from './ProgressBar';
import AsyncButton from '../components/AsyncButton';
import { Tooltip } from '@mui/material'

import LeftIcon from '@mui/icons-material/ChevronLeft'
import RightIcon from '@mui/icons-material/ChevronRight'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import CheckIcon from '@mui/icons-material/Check'
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DaysLeft from './DaysLeft'

let Progress = ({ dispatch, stage, canProceed, remaining, showList, segmentsCount }) => {
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
    modifier('is-loading')
    dispatch(nextStep())
      .then(() => modifier())
      .catch((e) => errorHandler(e, modifier));
  }

  const warningBorderStyle = {
    border: '1px solid rgba(17, 17, 17, 0.1)'
  }
  const bulkNav = (
    <div style={{ margin: 'auto' }}>
      <span className='is-gapless has-text-centered control has-addons'>
        <AsyncButton className={'is-warning'} onClick={(e, modifier) => {
          modifier('is-loading')
          dispatch(bulkProcess())
            .then(() => modifier())
        }} style={warningBorderStyle}>
          Bulk process all tracks
        </AsyncButton>
        <AsyncButton isFile={true} className='is-warning' title='Load LIFE file' style={{ ...warningBorderStyle, lineHeight: 'inherit' }} onRead={(text, modifier) => {
          modifier('is-loading')
          dispatch(loadLIFE(text))
            .then(() => {
              modifier('is-success', (c) => c !== 'is-warning')
              setTimeout(() => modifier(), 2000)
            })
            .catch((err) => {
              console.error(err)
              modifier('is-danger', (c) => c !== 'is-warning')
              setTimeout(() => modifier(), 2000)
            })
        }}>
          <span style={{ fontSize: '0.7rem' }}>
            <div>Load</div>
            <div>LIFE</div>
          </span>
        </AsyncButton>
      </span>
    </div>
  )

  const navNav = (
    <>
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
    </>
  )

  const remainingMessage = (n) => {
    switch (n) {
      case 0:
        return (
          <span>
            <CheckIcon /> There are no days left to process
          </span>
        )
      case 1:
        return (
          <span>
            <MoreVertIcon /> This is the last day to process
          </span>
        )
      case 1:
        return (
          <span>
            <MoreVertIcon /> There is one more day to process
          </span>
        )
      default:
        return (
          <span>
            <MoreHorizIcon /> { n } more days to process
          </span>
        )
    }
  }

  let subNav = null
  let toShow
  let detailsLabel

  if (showList) {
    toShow = (
      <ul className='is-flexgrow slide-from-top-fade-in' style={{ overflowY: 'auto' }}>
        {
          remaining.map((track, i) => {
            return (
              <li key={i}>
                { track.get('name') }
              </li>
            )
          })
        }
      </ul>
    )

    subNav = bulkNav
    toShow = <DaysLeft style={{ flexGrow: 1, overflowY: 'auto' }}/>
    detailsLabel = (
      <div style={{ color: 'gray', textAlign: 'center', fontSize: '0.9rem' }} className='clickable' onClick={() => dispatch(toggleRemainingTracks())}>
        <EditIcon/>Edit tracks of the current day
      </div>
    )
  } else {
    let style = { overflowY: 'auto' }
    if (stage === ANNOTATE_STAGE) {
      style = {
        ...style,
        overflowX: 'visible',
        paddingTop: '2px',
        minWidth: '100%',
        borderRadius: '0px 3px 3px 0px',
        backgroundColor: 'white'
      }
    }

    toShow = (
      <div className='is-flexgrow expand' style={{ style }} >
        <Pane className='is-flexgrow' width='100%'/>
      </div>
    )

    detailsLabel = (
      <div style={{ color: 'gray', textAlign: 'center', fontSize: '0.9rem' }} className='clickable' onClick={() => dispatch(toggleRemainingTracks())}>
        { remainingMessage(remaining.count()) }
      </div>
    )

    subNav = navNav
  }

  let OptionButton = ({children, className, description, onClick}) => {
    return (
        <a className={className} onClick={onClick}>    
            <Tooltip title={description}  placement="top" arrow>  
                { children }
            </Tooltip>
        </a>
    );
  }

  const multipleActions = (
    <div className='columns fade-in' style={{padding: '0px 50px 0px 50px'}}>
      <OptionButton className='button icon-button column' onClick={() => dispatch(showHideAll())} description='Toggle all'>
        <VisibilityIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }} />
      </OptionButton>
      <OptionButton className='button icon-button column' onClick={() => dispatch(downloadAll())} description='Download all'>
        <DownloadIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }} />
      </OptionButton>
      <OptionButton className='button icon-button column' onClick={() => dispatch(clearAll())} description='Delete all'>
        <DeleteIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }} />
      </OptionButton>
    </div>
  )

  let nav = (
    <div style={{ marginTop: '1.5rem' }}>
      { (!showList) && (segmentsCount > 1 && stage !== ANNOTATE_STAGE) ? multipleActions : null }
      <div className="columns" style={{textAlign: 'center'}}>
        { subNav }
      </div>
      { detailsLabel }
    </div>
  )

  return (
    <Card width="400" height="" top="99" left="99" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <ProgressBar />
      { toShow }
      { nav }
    </Card>
  )
}

const mapStateToProps = (state) => {
  return {
    stage: state.get('progress').get('step'),
    showList: state.get('ui').get('showRemainingTracks'),
    remaining: state.get('progress').get('remainingTracks'),
    canProceed: state.get('tracks').get('tracks').count() > 0,
    segmentsCount: state.get('tracks').get('segments').count()
  }
}

Progress = connect(mapStateToProps)(Progress)

export default Progress
