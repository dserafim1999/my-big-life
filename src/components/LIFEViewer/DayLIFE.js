import moment from "moment";
import React, { useState } from "react"
import { SEMANTIC_STYLES } from "../../constants";
import SpanLIFE from "./SpanLIFE";


/**
 * 
 * @constructor
 */

const DayLIFE = ({ day, onDayClick, onLocationClick }) => {
  const [isHover, setIsHover] = useState(false);
  let spans = [];
  
  const dayStyle = {
    padding: '5px 0',
    backgroundColor: isHover ? '#fcfcfc' : '',
    borderLeft: isHover ? '5px solid var(--main)' : '',
  }

  const onMouseEnter = () => {
    setIsHover(true);
  }

  const onMouseLeave = () => {
    setIsHover(false);
  }

  const onClick = () => {
    onDayClick(moment(day.date, "--YYYY_MM_DD"));
  }
  
  for (let [i, span] of day.spans.entries()) {
      spans.push(<SpanLIFE key={i} span={span} onLocationClick={onLocationClick}/>); 
  }

  return (
    <div style={dayStyle}>
      <p style={{margin: '5px'}}>
        <span 
          style={{ ...SEMANTIC_STYLES["_"], ...SEMANTIC_STYLES["Day"], cursor: 'pointer'}}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >{ day.date }</span>
      </p>
      <p style={{margin: '5px'}}>
        <span style={{ ...SEMANTIC_STYLES["_"], ...SEMANTIC_STYLES["Timezone"]}}>{ day.start_timezone }</span>
      </p>
      { spans }
    </div>
  );
}

DayLIFE.propTypes = {
}
  
export default DayLIFE;
