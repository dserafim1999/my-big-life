import React from 'react';

const blockStyle = {
  marginTop: '10px'
}
const blockHeader = {
  fontSize: '1.4rem'
}

const SectionBlock = ({ name, children, button }) => {
  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <h3 style={blockHeader}> {name} </h3>
        {button}
      </div>
      <div style={blockStyle}>
        {children}
      </div>
    </div>
  );
}

export default SectionBlock;