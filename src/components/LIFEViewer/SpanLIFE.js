import React, { useState } from "react"
import { SEMANTIC_STYLES } from "../../constants";

/**
 * 
 * @constructor
 */

const SpanLIFE = ({ span, isSelectedDay, onLocationClick }) => {
    const [isHover, setIsHover] = useState(false);

    const onMouseEnter = () => {
        if (isSelectedDay === undefined || isSelectedDay) setIsHover(true);
    }

    const onMouseLeave = () => {
        if (isSelectedDay === undefined || isSelectedDay) setIsHover(false);
    }

    const onClick = (place) => {
        if (isSelectedDay === undefined || isSelectedDay) onLocationClick(place);
    }

    const addOptionalSemantics = (type, value) => {
        return value && <span style={{ ...SEMANTIC_STYLES["_"], ...SEMANTIC_STYLES[type], margin: '3px'}}>{ value }</span>
    }

    const addPlaces = (places) => {
        // TODO consider '->' places
        return (
            <span 
                style={{ ...SEMANTIC_STYLES["_"], ...SEMANTIC_STYLES["Location"], border: isHover ? '2px solid var(--main)' : '', margin: '3px', cursor: 'pointer'}}
                onClick={() => onClick(span.place)}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >{ places }</span>
        );
    }

    const semantics = span.semantics ? ("{" + span.semantics.join("|") + "}") : undefined;
    const tags = span.tags ? ("[" + span.tags.join("|") + "]") : undefined;

    return (
        <div>
            <p style={{margin: '5px'}}>
                <span style={{ ...SEMANTIC_STYLES["_"], ...SEMANTIC_STYLES["Time"], marginRight: '3px'}}>{ span.start }</span>
                <b>-</b>
                <span style={{ ...SEMANTIC_STYLES["_"], ...SEMANTIC_STYLES["Time"], margin: '3px'}}>{ span.end }</span>
                <b>:</b>
                { addPlaces(span.place)}
                { addOptionalSemantics("Semantic", semantics) }
                { addOptionalSemantics("Tag", tags) }
            </p>
        </div>
  );
}

SpanLIFE.propTypes = {
}
  
export default SpanLIFE;
