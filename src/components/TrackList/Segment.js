import React, { useState } from 'react';

import SegmentToolbox from './SegmentToolbox';
import IconButton from '../../components/Buttons/IconButton';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Date from 'moment';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CalendarIcon from '@mui/icons-material/CalendarToday';
import FitIcon from '@mui/icons-material/ZoomOutMap';

import { connect } from 'react-redux';
import { centerMap } from '../../actions/map';
import { fitSegment, toggleSegmentVisibility } from '../../actions/segments';
import { highlightSegmentInTrack, highlightTrack as highlightTrackAction } from '../../actions/tracks';
import { SegmentRecord } from '../../records';

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

/**
 * Container that holds either the start or the end date
 * 
 * @constructor
 * @param {function} onClick Behaviour when container is clicked
 * @param {number} index
 * @param {Date} time Time to display
 */
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


/**
 * Segment Information container
 * 
 * @constructor
 * @param {SegmentRecord} segment Segment to be represented
 * @param {function} dispatch Redux store action dispatcher
 * @param {string | number} trackId Id for the track that contains the segment
 * @param {number} segmentId Segment's Id
 * @param {ImmutablePropTypes.list} points Segment points
 * @param {Date} start Segment's start date
 * @param {Date} end Segment's end date
 * @param {boolean} display If true, segment is displayed on the map
 * @param {string} color Hex code for Segment's color
 * @param {number} distance Total distance covered in Segment
 * @param {number} averageVelocity Average velocity travelled in Segment
 * @param {boolean} canEdit If true, Segment can be edited
 */
const Segment = ({ segment, dispatch, trackId, segmentId, points, start, end, display, color, distance, averageVelocity, canEdit = true }) => {
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

Segment.propTypes = {
  /** Segment to be represented */
  segment: PropTypes.instanceOf(SegmentRecord),
  /** Redux store action dispatcher */
  dispatch: PropTypes.func,
  /** Id for the track that contains the segment */
  trackId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  /** Segment's Id */
  segmentId: PropTypes.number,
  /** Segment points */
  points: ImmutablePropTypes.list,
  /** Segment's start date */
  start: PropTypes.instanceOf(Date), 
  /** Segment's end date */
  end: PropTypes.instanceOf(Date),
  /** If true, segment is displayed on the map */
  display: PropTypes.bool,
  /** Hex code for Segment's color */
  color: PropTypes.string,
  /** Total distance covered in Segment */
  distance: PropTypes.number,
  /** Average velocity travelled in Segment */
  averageVelocity: PropTypes.number,
  /** If true, Segment can be edited */
  canEdit: PropTypes.bool
}

export default connect(mapStateToProps)(Segment);