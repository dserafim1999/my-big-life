import React from 'react';
import DayLIFE from './DayLIFE';

const loadingStyle = {
  position: 'absolute', 
  top: '50%', 
  left: '50%', 
  transform: 'translate(-50%, -50%)'
}

/**
 * 
 * @constructor
 */

const LIFEViewer = ({ onDayClick, onLocationClick, life, isLoading }) => {
  const buildLIFERepresentation = (lifeJSON, onDayClick, onLocationClick) => {
    let days = [];
    for (let day of lifeJSON.days) {
        days.push(<DayLIFE day={day} onDayClick={onDayClick} onLocationClick={onLocationClick} key={day.date}/>); 
    }

    return React.createElement("div", {}, days);
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto'}}>
      { isLoading && (
        <div style={loadingStyle}>
          <div className='loader'/>
        </div>
      )}
      { life && !isLoading && buildLIFERepresentation(life, onDayClick, onLocationClick) }
    </div>
  )
}

LIFEViewer.propTypes = {
}
  
export default LIFEViewer;
