import React from 'react';
import { connect } from 'react-redux';
import {
  centerPointOnMap
} from '../../actions/segments';

import SegmentToolbox from './SegmentToolbox';

import CalendarIcon from '@mui/icons-material/CalendarToday';
import ClockIcon from '@mui/icons-material/AccessTime';
import { display } from '@mui/system';

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
  paddingTop: '1rem'
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
  const style = {
    borderLeft: '10px solid ' + color,
    paddingLeft: '2%'
  }

  return (
    <li className='slide-from-top-fade-in' style={{border: '1px solid #F0F0F0'}}>
      <div style={style}>
        <div>
          <div style={middleStatsUp} >
            <CalendarIcon style={{ fontSize: '0.8rem', verticalAlign: 'baseline' }} /> {end.fromNow()}
            <ClockIcon style={{ fontSize: '0.8rem', verticalAlign: 'baseline' }} /> {start.to(end, true)}
          </div>
          <div style={{ display: 'flex' }}>
            <SegmentStartEnd segmentId={segmentId} index={0} time={start} dispatch={dispatch} />
            <SegmentStartEnd segmentId={segmentId} index={-1} time={end} dispatch={dispatch} />
          </div>
          <div style={metricsStyle}>
            {points.count()} points, { distance.toFixed(2) } km at { averageVelocity.toFixed(2) } km/h
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