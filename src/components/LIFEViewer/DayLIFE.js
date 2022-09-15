import moment from "moment";
import React, { useState } from "react"
import { SEMANTIC_STYLES } from "../../constants";
import SpanLIFE from "./SpanLIFE";


/**
 * 
 * @constructor
 */

const DayLIFE = ({ day, isSelectedDay, onDayClick, onLocationClick }) => {
  const [isHover, setIsHover] = useState(false);
  let spans = [];

  const getStyle = () => {
    if (isSelectedDay === undefined) {
      return {
        padding: '5px 0',
        backgroundColor: isHover ? '#fcfcfc' : '',
        borderLeft: isHover ? '5px solid var(--main)' : '',
      }
    } else {
      return {
        padding: isSelectedDay ? '5px 0' : '',
        borderLeft: isSelectedDay || isHover ? '5px solid var(--main)' : '',
        opacity: isSelectedDay ? '1' : isHover ? '0.5' : '0.2'
      }
    }
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
      spans.push(<SpanLIFE key={i} span={span} isSelectedDay={isSelectedDay} onLocationClick={onLocationClick}/>); 
  }

  return (
    <div style={getStyle()}>
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
