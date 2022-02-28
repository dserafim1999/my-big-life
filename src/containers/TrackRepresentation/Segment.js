import React from 'react';
import { connect } from 'react-redux';
import {
  centerPointOnMap
} from '../../actions/segments';

import {
  centerMap
} from '../../actions/map';

import SegmentToolbox from './SegmentToolbox';

import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarIcon from '@mui/icons-material/CalendarToday';

import { toggleSegmentVisibility } from '../../actions/segments';
import { Tooltip } from '@mui/material';

const metricsStyle = {
  fontSize: '0.8rem',
  color: 'gray',
  margin: '0.1rem 0',
  textAlign: 'center'
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

const SegmentStartEnd = ({ onClick, index, time}) => {
  const descr = index === 0 ? 'from' : 'to';
 
  if (time) {
    return (
      <div className={'date-' + descr} onClick={onClick}>
        <div style={{ fontSize: '0.7rem', color: '#aaa' }}>{ descr }</div>
        <div>{time.format('L')}</div>
        <div>{time.format('LT')}</div>
      </div>
    );
  } else {
    return (<div></div>);
  }
}

const Segment = ({ segment, dispatch, segmentId, points, start, end, display, color, metrics, distance, averageVelocity }) => {
  const toggleTrack = () => dispatch(toggleSegmentVisibility(segmentId));
  
  const style = {
    borderLeft: '10px solid ' + color,
    paddingLeft: '2%',
    opacity: display ? 1 : 0.5,
    paddingBottom: '2px'
  }

  const fadeStyle = {
    fontWeight: 200
  }

  const centerOnPoint = (point) => {
    return (e) => {
      e.stopPropagation();
      dispatch(centerMap(point.get('lat'), point.get('lon')));
    }
  }

  return (
    <li className='slide-from-top-fade-in' style={{border: '1px solid #F0F0F0'}}>
      <div style={style}>
        <div>
          <div style={middleStatsUp} >
            {
              start && end
              ? <>
                  <CalendarIcon style={{ fontSize: '0.8rem', verticalAlign: 'baseline' }} /> {end.fromNow()} <span style={fadeStyle}> during </span> {start.to(end, true)}
                </>
              : null
            }
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SegmentStartEnd onClick={centerOnPoint(points.get(0))} index={0} time={start} />

            <a className={'icon-button button'} onClick={toggleTrack}>    
              <Tooltip title={'Toggle Segment Visibility'}  placement="top" arrow>  
                <VisibilityIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }}/>
              </Tooltip>
            </a>

            <SegmentStartEnd onClick={centerOnPoint(points.get(-1))} index={-1} time={end} />
          </div>
          <div style={metricsStyle}>
            { distance.toFixed(3) } km <span style={fadeStyle}>at</span> { averageVelocity.toFixed(2) } km/h
          </div>
        </div>

        <SegmentToolbox segment={segment} />
      </div>
    </li>
  )
}

const mapStateToProps = (state, { segment }) => {
  return {
    segment,
    segmentId: segment.get('id'),
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