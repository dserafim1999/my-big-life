import React from "react";
import IconButton from '../Buttons/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PropTypes from 'prop-types';

/**
 * Represents the selected day on the LIFE Viewer's header and allows editting and deleting the day
 * 
 * @param {object} day Day in question
 * @param {string} color Color that represents the day's trip on the map, if loaded
 * @param {function} onDeleteDay Behaviour when a day is deleted
 * @param {function} onEditDay Behaviour when a day is edited
 * 
 * @constructor
 */

const SelectedDay = ({ day, color, onDeleteDay, onEditDay }) => {
    return (
        <div style={{width: '100%', borderRadius: '15px', color: 'white', fontSize: '20px', backgroundColor: color}}>
            <div style={{ width: day ? '60%' : '100%', float:'left', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', height: '100%' }}>
                { day ? day.format("DD/MM/YYYY") : 'No day selected' }
            </div>
            { day && (
                <div style={{ float:'right', padding: '0 5px'}}>
                    <IconButton title={'Edit Day'} className={'is-blue'} onClick={onEditDay}>    
                        <EditIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }}/>
                    </IconButton>
                    <IconButton title={'Delete Day'} className={'is-red'} onClick={onDeleteDay}>    
                        <DeleteIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }}/>
                    </IconButton>
                </div>
            )}
        </div>
    );
}

SelectedDay.propTypes = {
    /** Day in question */
    day: PropTypes.object,
    /** Color that represents the day's trip on the map, if loaded */
    color: PropTypes.string,
    /** Behaviour when a day is deleted */
    onDeleteDay: PropTypes.func,
    /** Behaviour when a day is edited */
    onEditDay: PropTypes.func,
}
  
export default SelectedDay;
