import React, { useState } from 'react';
import { connect } from 'react-redux';

import {
  centerMap
} from '../../actions/map';

import SegmentToolbox from './SegmentToolbox';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import FitIcon from '@mui/icons-material/ZoomOutMap';

import { fitSegment, toggleSegmentVisibility } from '../../actions/segments';
import IconButton from '../../components/Buttons/IconButton';
import { highlightSegmentInTrack, highlightTrack as highlightTrackAction } from '../../actions/tracks';

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
        <div>{time.format('DD/MM/YYYY')}</div>
        <div>{time.format('LT')}</div>
      </div>
    );
  } else {
    return (<div></div>);
  }
}

const Segment = ({ segment, dispatch, trackId, segmentId, points, start, end, display, color, metrics, distance, averageVelocity, canEdit = true }) => {
  const [highlighted, setHighlighted] = useState(false);
  
  const toggleSegment = () => dispatch(toggleSegmentVisibility(segmentId));
  const fitToSegment = () => dispatch(fitSegment(segmentId));
  
  const highlightTrack = () => {
    var value;
    dispatch(highlightTrackAction(trackId, highlighted));
    
    if (!display) {
      value = true;
    } else {
      value = !highlighted;
    }
    setHighlighted(value);
  }

  const highlightSegment = () => {
    var value = !highlighted;
    if (!display) {
      value = true;
    }
    dispatch(highlightSegmentInTrack(trackId, segmentId, value));
    setHighlighted(value);
  }
  
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
    <li className='slide-from-top-fade-in' style={{border: '1px solid #F0F0F0', listStyleType: 'none'}}>
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
            { canEdit ? 
              (
                <div>
                  <IconButton title={'Highlight Segment'} onClick={highlightSegment}>    
                    <VisibilityIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }}/>
                  </IconButton>
                  <IconButton title={'Toggle Segment Visibility'} onClick={toggleSegment}>    
                    <VisibilityOffIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }}/>
                  </IconButton>
                </div>
              ) :
              (
                <div>
                  <IconButton title={'Fit Segment'} onClick={fitToSegment}>    
                      <FitIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }}/>
                  </IconButton>
                  <IconButton title={'Highlight Track'} onClick={() => dispatch(highlightTrack)}>    
                    <VisibilityIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }}/>
                  </IconButton>
                </div>
              )
            }
            <SegmentStartEnd onClick={centerOnPoint(points.get(-1))} index={-1} time={end} />
          </div>
          <div style={metricsStyle}>
            { distance.toFixed(3) } km <span style={fadeStyle}>at</span> { averageVelocity.toFixed(2) } km/h
          </div>
        </div>

        { canEdit && <SegmentToolbox segment={segment} /> }
      </div>
    </li>
  )
}

const mapStateToProps = (state, { segment }) => {
  return {
    segment,
    trackId: segment.get('trackId'),
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