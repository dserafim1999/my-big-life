import React from 'react'
import Overlay from '.';

const loadingStyle = {
    position: 'absolute', 
    top: '50%', 
    left: '50%', 
    transform: 'translate(-50%, -50%)'
}

const LoadingOverlay = ({}) => {
  return (
    <Overlay>
        <div style={loadingStyle}>
            <div className='loader'/>
        </div>
    </Overlay>
  );
}

export default LoadingOverlay;
