import moment from 'moment';
import React, { useRef } from 'react';
import DayLIFE from './DayLIFE';
import IconButton from '../Buttons/IconButton';
import DeselectDayIcon from '@mui/icons-material/EventBusy';
import SearchDayIcon from '@mui/icons-material/Event';

import SelectedDay from './SelectedDay';

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

const LIFEViewer = ({ onDayClick, onLocationClick, onSearchDay, onDeselectDay, onDeleteDay, onEditDay, header, life, selectedDay, selectedDayColor, isLifeLoading }) => {
  var lifeRef = useRef(null);

  const buildLIFERepresentation = (lifeJSON, onDayClick, onLocationClick) => {
    let days = [];
    for (let day of lifeJSON.days) {
      if (selectedDay) {
        const date = moment(day.date, "--YYYY_MM_DD");
        days.push(<DayLIFE day={day} color={selectedDayColor} isSelectedDay={date.isSame(selectedDay)} onDayClick={onDayClick} onLocationClick={onLocationClick} key={day.date} lifeRef={lifeRef}/>); 
      } else {
        days.push(<DayLIFE day={day} color={selectedDayColor} onDayClick={onDayClick} onLocationClick={onLocationClick} key={day.date}/>); 
      }
    }

    return React.createElement("div", {}, days);
  }

  const buildHeaderComponent = () => {
    return header && (
      <div style={{ width: '100%', display: 'flex', paddingBottom: '5px'}}>
        <SelectedDay day={selectedDay} color={selectedDayColor} onEditDay={onEditDay} onDeleteDay={onDeleteDay}/>
        <div style={{ display: 'flex', paddingLeft: '5px' }}>
          <IconButton title={'Search Day'} onClick={onSearchDay}>    
              <SearchDayIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }}/>
          </IconButton>
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
}
  
export default LIFEViewer;
