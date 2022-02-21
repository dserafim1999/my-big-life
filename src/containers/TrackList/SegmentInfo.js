import React from 'react';

import SegmentToolbox from './SegmentToolbox';
import { centerMap } from '../../actions/ui';

const style = {
  fontSize: '1rem',
  color: 'gray',
  margin: '0.1rem 0'
}

const SegmentInfo = ({ dispatch, segment }) => {
  const id = segment.get('id');
  const points = segment.get('points');
  const start = segment.get('start');
  const end = segment.get('end');
  const display = segment.get('display');
  const color = segment.get('color');
  const metrics = segment.get('metrics').toJS();

  let distance = metrics.totalDistance;
  let avrgVel = metrics.averageVelocity;

  const centerOnPoint = (index) => {
    return (e) => {
      e.stopPropagation();
      dispatch(centerMap(points.get(index).get('lat'), points.get(index).get('lon')));
    }
  }

  return (
    <div className='slide-from-top-fade-in' style={{border: '1px solid #F0F0F0'}}>
      <li style={{borderLeft: '10px solid ' + color, paddingLeft: '2%', opacity: display ? 1 : 0.5}} >
        <div>
            <div className='' style={{ display: 'flex' }}>
                <div className='column is-half' onClick={centerOnPoint(0)}>
                  <div style={{ fontSize: '0.7rem', color: '#aaa' }}>start</div>
                  <div>{start.format('L')}</div>
                  <div>{start.format('LT')}</div>
                </div>
                <div className='column is-half' onClick={centerOnPoint(-1)} style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: '#aaa' }}>end</div>
                  <div>{end.format('L')}</div>
                  <div>{end.format('LT')}</div>
                </div>
            </div>
            <div style={style}>{end.fromNow()} during {start.to(end, true)}</div>
            <div style={style}>{points.count()} points, { distance.toFixed(2) } km at { avrgVel.toFixed(2) } km/h</div>
        </div>
        <SegmentToolbox segment={segment} dispatch={dispatch}/>
      </li>
    </div>
  )
}

export default SegmentInfo;