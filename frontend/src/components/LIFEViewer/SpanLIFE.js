import React, { useState } from "react"

import PropTypes from 'prop-types';

import { SEMANTIC_STYLES } from "../../constants";

/**
 * Represent a span in the current LIFE file
 * 
 * @param {object} span Span in question
 * @param {boolean} isSelectedDay If day is currently selected
 * @param {function} onLocationClick Behaviour when location is selected
 * 
 * @constructor
 */

const SpanLIFE = ({ span, isSelectedDay, onLocationClick }) => {
    const [hover, setHover] = useState('');

    const onMouseEnter = (location) => {
        if (isSelectedDay === undefined || isSelectedDay) {
            setHover(location);
        }
    }

    const onMouseLeave = () => {
        if (isSelectedDay === undefined || isSelectedDay) {
            setHover('');
        }
    }

    const onClick = (place) => {
        if (isSelectedDay === undefined || isSelectedDay) onLocationClick(place);
    }

    const addOptionalSemantics = (type, value) => {
        return value && <span style={{ ...SEMANTIC_STYLES["_"], ...SEMANTIC_STYLES[type], margin: '3px'}}>{ value }</span>
    }

    const renderLocationPill = (location) => {
        return (
            <span 
                style={{ ...SEMANTIC_STYLES["_"], ...SEMANTIC_STYLES["Location"], border: hover === location ? '2px solid var(--main)' : '', margin: '3px', cursor: 'pointer'}}
                onClick={() => onClick(location)}
                onMouseEnter={() => onMouseEnter(location)}
                onMouseLeave={onMouseLeave}
            >{ location }</span>
        )
    }

    const renderTimePill = (time) => {
        return <span style={{ ...SEMANTIC_STYLES["_"], ...SEMANTIC_STYLES["Time"], marginRight: '3px'}}>{ time }</span>
    }

    const addPlaces = (places) => {
        if (Array.isArray(places)) {
            return (
                <>
                    { renderLocationPill(places[0]) }
                    {' -> '} 
                    { renderLocationPill(places[1]) }
                </>
            );
        } else {
            return renderLocationPill(places);
        }
    }

    const semantics = span.semantics ? ("{" + span.semantics.join(" | ") + "}") : undefined;
    const tags = span.tags ? ("[" + span.tags.join(" | ") + "]") : undefined;

    return (
        <div>
            <p style={{margin: '5px'}}>
                { renderTimePill(span.start)}
                <b>-</b>
                { renderTimePill(span.end)}
                <b>:</b>
                { addPlaces(span.place)}
                { addOptionalSemantics("Tag", tags) }
                { addOptionalSemantics("Semantic", semantics) }
            </p>
        </div>
  );
}

SpanLIFE.propTypes = {
    /** Span in question */
    span: PropTypes.object,
    /** If day is currently selected */
    isSelectedDay: PropTypes.bool,
    /** Behaviour when location is selected */
    onLocationClick: PropTypes.func
}
  
export default SpanLIFE;
