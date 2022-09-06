import React from "react"

import PropTypes from 'prop-types';

const loadingBarStyle = {
    width: '100%', 
    backgroundColor: 'lightgrey', 
    marginTop: '15px', 
    borderRadius: '5px',
}

/**
 * Dynamic loading bar with percentage value
 * 
 * @constructor
 * @param {number} value Percentage that is loaded
 * @param {number} height Bar height
 * @param {boolean} showPercentage If enabled, percentage value is displayed on the bar
 */
const LoadingBar = ({value, height, showPercentage = true}) => {
    const percentage = isNaN(value) ? 0 : Number.parseFloat(value).toFixed(2);

    return (
        <div style={{...loadingBarStyle, height: height + 'px'}}>
            <div style={{height: '100%', width: value + '%', backgroundColor: 'var(--main)', borderRadius: '5px'}}>
                { showPercentage && (
                    <span style={{color: 'white', verticalAlign: 'middle', textOverflow: 'ellipsis' }}>{ percentage + '%'}</span>
                )}
            </div>
        </div>
    );
}

LoadingBar.propTypes = {
    /** Percentage that is loaded */
    value: PropTypes.number, 
    /** Bar height */
    height: PropTypes.number, 
    /** If enabled, percentage value is displayed on the bar */
    showPercentage: PropTypes.bool 
}

export default LoadingBar;