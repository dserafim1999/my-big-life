import React, { Component, useRef, useState } from 'react';

import moment from 'moment';
import DayLIFE from './DayLIFE';
import IconButton from '../Buttons/IconButton';
import DeselectDayIcon from '@mui/icons-material/EventBusy';
import SearchDayIcon from '@mui/icons-material/Event';
import SelectedDay from './SelectedDay';
import MetaLIFE from './MetaLIFE';
import PropTypes from 'prop-types';
import Date from 'moment';
import QueryDatePicker from '../Form/QueryDatePicker';

const loadingStyle = {
  position: 'absolute', 
  top: '50%', 
  left: '50%', 
  transform: 'translate(-50%, -50%)'
}

/**
 * Displays a LIFE format file, allowing for day/location selection and more.
 * 
 * @param {function} onDayClick Behaviour when a day is selected
 * @param {function} onLocationClick Behaviour when a location is selected
 * @param {function} onSearchDay Behaviour to search for a day
 * @param {function} onDeselectDay Behaviour when a day is deselected
 * @param {function} onDeleteDay Behaviour when a day is deleted
 * @param {function} onEditDay Behaviour when a day is edited
 * @param {boolean} header Component that can be added to the Card's header. If none, no header is displayed
 * @param {object} life Object that contains all LIFE format information
 * @param {Date} selectedDay Day that is currently selected
 * @param {string} selectedDayColor Color of a day's trip, if said trip is loaded on map
 * @param {boolean} isLifeLoading If LIFE object is currently loading
 * @constructor
 */

const LIFEViewer = ({ onDayClick, onLocationClick, onSearchDay, onDeselectDay, onDeleteDay, onEditDay, header, life, selectedDay, selectedDayColor, isLifeLoading }) => {
  var lifeRef = useRef(null);

  const calendarIcon = (
    <IconButton title='Search Day' tooltipPlacement="bottom" style={{padding: '4px'}}>
          <SearchDayIcon sx={{padding: '2px'}}/>
    </IconButton>
  );

  const buildLIFERepresentation = (lifeJSON, onDayClick, onLocationClick) => {
    let days = [];
    let meta = (
      <MetaLIFE 
        categories={life.categories} 
        coordinates={life.coordinates} 
        locationSwaps={life.locationswaps} 
        nameSwaps={life.nameswaps}
        superPlaces={life.superplaces}
        onLocationClick={onLocationClick}
      />
    );

    for (let day of lifeJSON.days) {
      if (selectedDay) {
        const date = moment(day.date, "--YYYY_MM_DD");
        days.push(<DayLIFE day={day} color={selectedDayColor} isSelectedDay={date.isSame(selectedDay)} onDayClick={onDayClick} onLocationClick={onLocationClick} key={day.date} lifeRef={lifeRef}/>); 
      } else {
        days.push(<DayLIFE day={day} color={selectedDayColor} onDayClick={onDayClick} onLocationClick={onLocationClick} key={day.date}/>); 
      }
    }

    return React.createElement("div", {}, [meta, days]);
  }

  const onCloseDate = (clear) => {
    if (clear) {
      setDate("--/--/----");
    }

    setIsDateOpen(false);
  }

  const [dateOpen, setIsDateOpen] = useState(false);
  const [date, setDate] = useState("--/--/----");

  const buildHeaderComponent = () => {
    return header && (
      <div style={{ width: '100%', display: 'flex', paddingBottom: '5px'}}>
        <SelectedDay day={selectedDay} color={selectedDayColor} onEditDay={onEditDay} onDeleteDay={onDeleteDay}/>
        <div style={{ display: 'flex', paddingLeft: '5px' }}>
          <QueryDatePicker
            open={dateOpen}
            value={date}
            onChange={(newValue) => onSearchDay(moment(newValue, "DD/MM/YYYY"))}
            onClick={() => setIsDateOpen(true)}
            onClose={(clear) => onCloseDate(clear)}
            calendarIcon={calendarIcon}
            style={{width: "34px"}}
          />
          <IconButton title={'Deselect Day'} onClick={onDeselectDay}>    
              <DeselectDayIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }}/>
          </IconButton>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%'}}>
      { isLifeLoading && (
        <div style={loadingStyle}>
          <div className='loader'/>
        </div>
      )}
      { life && (
        <div style={{ height: '100%'}}>
          { buildHeaderComponent() }
          <div ref={lifeRef} style={{ height: header ? '90%' : '100%', overflowY: 'auto'}}>
            { buildLIFERepresentation(life, onDayClick, onLocationClick) }
          </div>
        </div>
      ) 
      }
    </div>
  )
}

LIFEViewer.propTypes = {
  /** Behaviour when a day is selected */ 
  onDayClick: PropTypes.func, 
  /** Behaviour when a location is selected */
  onLocationClick: PropTypes.func,
  /** Behaviour to search for a day */
  onSearchDay: PropTypes.func, 
  /** Behaviour when a day is deselected */
  onDeselectDay: PropTypes.func, 
  /** Behaviour when a day is deleted */
  onDeleteDay: PropTypes.func, 
  /** Behaviour when a day is edited */
   onEditDay: PropTypes.func, 
  /** If header component should be displayed */
  header: PropTypes.bool,
  /** Object that contains all LIFE format information */
  life: PropTypes.object,
  /** Color of a day's trip, if said trip is loaded on map */
  selectedDay: PropTypes.instanceOf(Date),
  /** Day that is currently selected */
  selectedDayColor: PropTypes.string,
  /** If LIFE object is currently loading */
  isLifeLoading: PropTypes.bool
}
  
export default LIFEViewer;
