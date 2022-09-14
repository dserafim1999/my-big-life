import React from 'react';
import PropTypes from 'prop-types';
import DayLIFE from './DayLIFE';

/**
 * 
 * @function
 * @returns {string}  
 */
const buildLIFERepresentation = (lifeJSON, onDayClick, onLocationClick) => {
    let days = [];
    for (let day of lifeJSON.days) {
        days.push(<DayLIFE day={day} onDayClick={onDayClick} onLocationClick={onLocationClick} key={day.date}/>); 
    }

    return React.createElement("div", {}, days);
}

buildLIFERepresentation.propTypes = { 
}

export default buildLIFERepresentation;