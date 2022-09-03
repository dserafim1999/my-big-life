import React, { useState } from "react";

import Draggable from 'react-draggable';
import PropTypes from 'prop-types';
import { IconButton } from "@mui/material";

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";

const wrapper = {
    position: 'fixed',
    backgroundColor: 'white',
    borderRadius: '15px',
    zIndex: '1000',
}

const cardOpenStyle = {
    position: "absolute",
    cursor: "pointer",
    backgroundColor: "lightgrey",
    color: "grey",
    width: "40px",
    height: "40px",
    borderRadius: "20px",
    top: "-5px",
    border: "3px solid white",
    zIndex: '1001'
}


/**
 * General Card description.
 */
const Card = ({ width, height, verticalOffset, horizontalOffset, title = undefined, children, isDraggable = true, containerStyle, innerStyle, canToggleVisibility = true, onClose = undefined }) => {
    const innerWidth = width != undefined ? window.innerWidth - width : window.innerWidth;
    const innerHeight = height != undefined ? window.innerHeight - height : window.innerHeight;

    var initState = {
        controledPosition: {
            x: innerWidth * horizontalOffset/100, y: innerHeight * verticalOffset/100 
        }
    }

    const [cardOpen, setIsCardOpen] = useState(true);

    const [ state, setState ] = useState(initState);

    const onStart = () => {
        if (!isDraggable) {
            return false;
        }
    };

    const onStop = () => {};
    
    const onControlledDrag = (e, position) => {
        const {x, y} = position;
        setState({controledPosition: {x, y}});
    };
    
    const dragHandlers = {onStart: onStart, onStop: onStop};
    const { controledPosition: initPosition } = state;

    width = cardOpen ? width : 0;

    var cardStyle =  {
        ...wrapper, 
        width: width != undefined ? width + 'px' : '', 
        height: height != undefined ? height+'px' : ''
    }
    cardStyle = {...containerStyle, ...cardStyle};

    const toggleCardButton = () => {
        return canToggleVisibility &&
            (
                <div style={{...cardOpenStyle, backgroundColor: cardOpen ? 'lightgrey' : "#284760", left: '-5px'}}>
                    <IconButton onClick={() => setIsCardOpen(!cardOpen)} style={{top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
                        { cardOpen ? 
                            <VisibilityOffIcon style={{color: 'white'}}/> : 
                            <VisibilityIcon style={{color: 'white'}}/>
                        }
                    </IconButton>
                </div>
            );
    }

    const closeCardButton = () => {
        return canToggleVisibility &&
            (
                <div style={{...cardOpenStyle, backgroundColor: "#a42525", right: '-5px'}}>
                    <IconButton onClick={onClose} style={{top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
                        { 
                            <CloseIcon style={{color: 'white'}}/>
                        }
                    </IconButton>
                </div>
            );
    }

    return (
        <Draggable position={initPosition} {...dragHandlers} onDrag={onControlledDrag}>
            <div style={{...cardStyle, cursor: isDraggable ? 'move' : ''}}>
                <div style={{width: '100%', height: '100%', padding: '10px', ...innerStyle}} className="cardContent">
                    { toggleCardButton() }
                    { cardOpen && (
                        <>
                            { onClose && closeCardButton() }
                            { title && <h1 style={{margin: '10px 0px 20px', fontSize: '1.6rem', textAlign: 'center'}}>{title}</h1> }
                            { children }
                        </>
                    )}
                </div>
            </div>
        </Draggable>
    )
};


Card.propTypes = {
    width: PropTypes.number, 
    height: PropTypes.number,
    /** Number between 0-100 */ 
    verticalOffset: PropTypes.number, 
    /** Number between 0-100 */ 
    horizontalOffset: PropTypes.number, 
    title: PropTypes.string, 
    children: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.arrayOf(PropTypes.object)
    ]), 
    isDraggable: PropTypes.bool, 
    containerStyle: PropTypes.string, 
    innerStyle: PropTypes.string, 
    canToggleVisibility: PropTypes.bool, 
    onClose: PropTypes.func
  };

export default Card;