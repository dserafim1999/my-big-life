import React from "react";
import IconButton from '../Buttons/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { SEMANTIC_STYLES } from "../../constants";

/**
 * 
 * @constructor
 */

const SelectedDay = ({ day, onDeleteDay, onEditDay }) => {
    return (
        <div style={{width: '100%', borderRadius: '15px', color: 'white', fontSize: '20px', backgroundColor: 'lightgrey'}}>
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
}
  
export default SelectedDay;
