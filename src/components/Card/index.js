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
 * Container that houses other components above the map. These can be dragged, hidden and/or closed.
 * 
 * @constructor
 * @param {number} width 
 * @param {number} height 
 * @param {number} verticalOffset Number between 0-100 
 * @param {number} horizontalOffset Number between 0-100 
 * @param {string} title Title to be displayed above the card's content
 * @param {Object | Array<Object>} children
 * @param {bool} isDraggable 
 * @param {bool} canToggleVisibility If enabled, a hide/show icon will be displayed on the top left corner 
 * @param {function} onClose If set, a close button will de displayed on the top right corner with said behaviour on an onClick event
 * @param {string} containerStyle Extra styling for outer container 
 * @param {string} innerStyle Extra styling for inner content
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
    /** Title to be displayed above the card's content */ 
    title: PropTypes.string, 
    children: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.arrayOf(PropTypes.object)
    ]), 
    /** If enabled, card can be dragged around the screen */
    isDraggable: PropTypes.bool, 
    /** If enabled, a hide/show icon will be displayed on the top left corner */
    canToggleVisibility: PropTypes.bool,
    /** If set, a close button will de displayed on the top right corner with said behaviour on an onClick event */ 
    onClose: PropTypes.func,
    /** Extra styling for outer container */
    containerStyle: PropTypes.string,
    /** Extra styling for inner content */
    innerStyle: PropTypes.string, 
};

export default Card;