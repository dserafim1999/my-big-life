import React from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';

const remainingMessage = (n) => {
    switch (n) {
        case 0:
            return (
                <span>
                    <CheckIcon /> Rescan input folder
                </span>
            );
        case 1:
            return (
                <span>
                    <MoreVertIcon /> This is the last day to process
                </span>
            );
        case 1:
            return (
                <span>
                    <MoreVertIcon /> There is one more day to process
                </span>
            );
        default:
            return (
                <span>
                    <MoreHorizIcon /> { n } more days to process
                </span>
            );
    }
}

const PaneDrawer = ({ showList, remainingCount, onClick }) => {
  return (
    <div style={{ color: 'gray', textAlign: 'center', fontSize: '0.9rem' }} className='clickable' onClick={onClick}>
      {
        showList
          ? <div><EditIcon/>Edit tracks of the current day</div>
        : remainingMessage(remainingCount)
      }
    </div>
  )
}

export default PaneDrawer