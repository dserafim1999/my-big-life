import React, { useRef, useState } from "react"

import moment from "moment";
import SpanLIFE from "./SpanLIFE";
import PropTypes from "prop-types";

import { SEMANTIC_STYLES } from "../../constants";

/**
 * Represents a day in the current LIFE file
 * 
 * @param {object} day Day in question
 * @param {string} color Color that represents the day's trip on the map, if loaded
 * @param {boolean} isSelectedDay If day is currently selected
 * @param {function} onDayClick Behaviour when day is selected
 * @param {function} onLocationClick Behaviour when location is selected
 * 
 * @constructor
 */

const DayLIFE = ({ day, color, isSelectedDay, onDayClick, onLocationClick }) => {
  const [isHover, setIsHover] = useState(false);
  let dayRef = useRef(null);
  let spans = [];

  const handleScrollToDay = () => {
    if (dayRef.current && isSelectedDay) {
      dayRef.current.scrollIntoView();
    }

  }

  const getStyle = () => {
    if (isSelectedDay === undefined) {
      return {
        padding: '5px 0',
        backgroundColor: isHover ? '#fcfcfc' : '',
        borderLeft: isHover ? ('5px solid ' + color) : '',
      }
    } else {
      return {
        padding: isSelectedDay ? '5px 0' : '',
        borderLeft: isSelectedDay || isHover ? ('5px solid ' + (isSelectedDay ? color : 'lightgrey')) : '',
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

  const renderDayPill = (date) => {
    return (
      <span 
        style={{ ...SEMANTIC_STYLES["_"], ...SEMANTIC_STYLES["Day"], cursor: 'pointer', opacity: '1'}}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >{ date }</span>
    );
  }

  const renderTimezonePill = (timezone) => {
    return <span style={{ ...SEMANTIC_STYLES["_"], ...SEMANTIC_STYLES["Timezone"]}}>{ timezone }</span>
  }
  
  for (let [i, span] of day.spans.entries()) {
      spans.push(<SpanLIFE key={i} span={span} isSelectedDay={isSelectedDay} onLocationClick={onLocationClick}/>); 
  }

  handleScrollToDay();

  return (
    <div ref={dayRef} style={getStyle()}>
      <p style={{margin: '5px'}}>
        { renderDayPill(day.date)} 
      </p>
      <div style={{opacity: isSelectedDay === undefined || isSelectedDay ? '1' : isHover ? '0.5' : '0.2'}}>
        <p style={{margin: '5px'}}>
          { renderTimezonePill(day.start_timezone) }
        </p>
        { spans }
      </div>
    </div>
  );
}

DayLIFE.propTypes = {
  /** Day in question */
  day: PropTypes.object,
  /** Color that represents the day's trip on the map, if loaded */
  color: PropTypes.string,
  /** If day is currently selected */
  isSelectedDay: PropTypes.bool,
  /** Behaviour when day is selected */
  onDayClick: PropTypes.func,
  /** Behaviour when location is selected */
  onLocationClick: PropTypes.func,
}
  
export default DayLIFE;
