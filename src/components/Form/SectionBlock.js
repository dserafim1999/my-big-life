import React from 'react';

const blockStyle = {
  marginTop: '10px'
}
const blockHeader = {
  fontSize: '1.4rem'
}

const SectionBlock = ({ name, children }) => {
  return (
    <div>
      <h3 style={blockHeader}> {name} </h3>
      <div style={blockStyle}>
        {children}
      </div>
    </div>
  );
}

export default SectionBlock;