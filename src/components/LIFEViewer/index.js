import React from 'react';
import buildLIFERepresentation from './buildLIFERepresentation';

/**
 * 
 * @constructor
 */

const LIFEViewer = ({ onDayClick, onLocationClick, life, dispatch }) => {
  return (
    <div style={{whiteSpace: 'pre-wrap', height: '100%', overflowY: 'auto'}}>
        { life && buildLIFERepresentation(life, onDayClick, onLocationClick) }
    </div>
  )
}

LIFEViewer.propTypes = {
}
  
export default LIFEViewer;
