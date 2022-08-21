import React from 'react'

const overlayStyle = {
  position: 'fixed',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(128, 128, 128, 0.75)',
  zIndex: '1000'
}

const Overlay = ({ children, ...props }) => {
  return (
    <div style={overlayStyle} {...props}>
      { children }
    </div>
  );
}

export default Overlay;
