import React from 'react';

import SegmentToolbox from './SegmentToolbox';

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

  return (
    <div style={{border: '1px solid #F0F0F0'}}>
      <li style={{borderLeft: '10px solid ' + color, paddingLeft: '2%', opacity: display ? 1 : 0.5}} >
        <div>
            <div style={style}>{start.format('L')} - {end.format('L')}</div>
            <div style={style}>{start.format('LT')} - {end.format('LT')}</div>
            <div style={style}>{end.fromNow()} during {start.to(end, true)}</div>
            <div style={style}>{points.count()} points, { distance.toFixed(2) } km at { avrgVel.toFixed(2) } km/h</div>
        </div>
        <SegmentToolbox segment={segment} dispatch={dispatch}/>
      </li>
    </div>
  )
}

export default SegmentInfo;