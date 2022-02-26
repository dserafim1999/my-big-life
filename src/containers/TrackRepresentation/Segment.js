import React from 'react';
import { connect } from 'react-redux';
import {
  centerPointOnMap
} from '../../actions/segments';

import SegmentToolbox from './SegmentToolbox';

import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarIcon from '@mui/icons-material/CalendarToday';

import { toggleSegmentVisibility } from '../../actions/segments';
import { Tooltip } from '@mui/material';

const metricsStyle = {
  fontSize: '0.8rem',
  color: 'gray',
  margin: '0.1rem 0'
}

const middleStatsBase = {
  fontSize: '0.8rem'
}

const middleStatsDown = {
  ...middleStatsBase,
  textAlign: 'center'
}

const middleStatsUp = {
  ...middleStatsDown,
  paddingTop: '0.5rem'
}

const middleStatsChild = {
  ...middleStatsBase,
  verticalAlign: 'baseline'
}

const SegmentStartEnd = ({ dispatch, segmentId, index, time }) => {
  const descr = index === 0 ? 'from' : 'to';
  const centerOnPoint = (index) => {
    return (e) => {
      e.stopPropagation();
      // dispatch(centerMap(points.get(index).get('lat'), points.get(index).get('lon')))
      dispatch(centerPointOnMap(segmentId, index));
    }
  }
  return (
    <div className={'date-' + descr} onClick={centerOnPoint(index)}>
      <div style={{ fontSize: '0.7rem', color: '#aaa' }}>{ descr }</div>
      <div>{time.format('L')}</div>
      <div>{time.format('LT')}</div>
    </div>
  )
}

const Segment = ({ dispatch, segmentId, points, start, end, display, color, metrics, distance, averageVelocity }) => {
  const toggleTrack = () => dispatch(toggleSegmentVisibility(segmentId));
  
  const style = {
    borderLeft: '10px solid ' + color,
    paddingLeft: '2%',
    opacity: display ? 1 : 0.5,
  }

  const fadeStyle = {
    fontWeight: 200
  }

  return (
    <li className='slide-from-top-fade-in' style={{border: '1px solid #F0F0F0'}}>
      <div style={style}>
        <div>
          <div style={middleStatsUp} >
            <CalendarIcon style={{ fontSize: '0.8rem', verticalAlign: 'baseline' }} /> {end.fromNow()} <span style={fadeStyle}> during </span> {start.to(end, true)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SegmentStartEnd segmentId={segmentId} index={0} time={start} dispatch={dispatch} />

            <a className={'icon-button button'} onClick={toggleTrack}>    
              <Tooltip title={'Toggle Segment Visibility'}  placement="top" arrow>  
                <VisibilityIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }}/>
              </Tooltip>
            </a>

            <SegmentStartEnd segmentId={segmentId} index={-1} time={end} dispatch={dispatch} />
          </div>
          <div style={metricsStyle}>
            { distance.toFixed(3) } km <span style={fadeStyle}>at</span> { averageVelocity.toFixed(2) } km/h
          </div>
        </div>

        <SegmentToolbox segmentId={segmentId} />
      </div>
    </li>
  )
}

const mapStateToProps = (state, { segmentId }) => {
  const segment = state.get('tracks').get('segments').get(segmentId);
  return {
    segmentId,
    points: segment.get('points'),
    color: segment.get('color'),
    display: segment.get('display'),
    start: segment.getStartTime(),
    end: segment.getEndTime(),
    distance: segment.get('metrics').get('distance'),
    averageVelocity: segment.get('metrics').get('averageVelocity')
  }
}

export default connect(mapStateToProps)(Segment);