import React from 'react';
import AsyncButton from './AsyncButton';

const BulkButtons = ({ onBulkClick, onLifeRead }) => {
  const warningBorderStyle = {
    border: '1px solid rgba(17, 17, 17, 0.1)'
  }

  const lifeBtnStyle = {
    ...warningBorderStyle,
    lineHeight: 'inherit'
  }

  return (
    <div style={{ margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <span className='is-gapless has-text-centered control has-addons'>
        <AsyncButton title='Bulk process all tracks in input folder' className={'is-blue'} onClick={onBulkClick} style={warningBorderStyle}>
          Bulk process all tracks
        </AsyncButton>

        <AsyncButton
          isFile={true} className='is-light' title='Load LIFE file'
          style={lifeBtnStyle} onRead={onLifeRead}>
          <span style={{ fontSize: '0.7rem', cursor: 'pointer' }}>
            <div>Load</div>
            <div>LIFE</div>
          </span>
        </AsyncButton>
      </span>
    </div>
  );
}

export default BulkButtons