import React from 'react';
import LeftIcon from '@mui/icons-material/ChevronLeft';
import RightIcon from '@mui/icons-material/ChevronRight';

const flexAlignStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  margin: 'auto'
}

const DetailPopup = ({ lat, lon, time, distance, velocity, i, onMove, count }) => {
  const displayPrev = i !== 0;
  const displayNext = (i + 1) < count;
  const styleLeft = Object.assign({}, flexAlignStyle, { opacity: displayPrev ? 1 : 0.5 });
  const styleRight = Object.assign({}, flexAlignStyle, { opacity: displayNext ? 1 : 0.5 });

  return (
    <div className='is-flex'>
      <LeftIcon sx={{ fontSize: 40 }} className='clickable' style={styleLeft} onClick={() => (displayPrev ? onMove(i - 1) : null)} />
      <span>
        <div>#<strong>{i + 1}</strong></div>
        <div>Lat: <strong>{lat}</strong> Lon: <strong>{lon}</strong></div>
        <div>Time: <strong>{time.format('dddd, MMMM Do YYYY, HH:mm:ss')}</strong></div>
        <div><strong>{(distance * 1000).toFixed(3)}</strong>m at <strong>{velocity.toFixed(3)}</strong>km/h</div>
      </span>
      <RightIcon sx={{ fontSize: 40 }} className='clickable' style={styleRight} onClick={() => (displayNext ? onMove(i + 1) : null)}/>
    </div>
  );
}

export default DetailPopup;
