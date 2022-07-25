import React, { useState } from "react";

import Draggable from 'react-draggable';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton } from "@mui/material";

const wrapper = {
    position: 'fixed',
    backgroundColor: 'white',
    borderRadius: '15px',
    zIndex: '1000',
}

const panelOpenStyle = {
    position: "absolute",
    cursor: "pointer",
    backgroundColor: "lightgrey",
    color: "grey",
    width: "40px",
    height: "40px",
    borderRadius: "20px",
    left: "-5px",
    top: "-5px",
    border: "3px solid white",
    zIndex: '1001'
}

const Card = ({ width, height, verticalOffset, horizontalOffset, title = undefined, children, isDraggable = true, containerStyle, innerStyle, canToggleVisibility = true }) => {
    const innerWidth = width != undefined ? window.innerWidth - width : window.innerWidth;
    const innerHeight = height != undefined ? window.innerHeight - height : window.innerHeight;

    var initState = {
        controledPosition: {
            x: innerWidth * horizontalOffset/100, y: innerHeight * verticalOffset/100 
        }
    }

    const [panelOpen, setIsPanelOpen] = useState(true);

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

    width = panelOpen ? width : 0;

    var cardStyle =  {
        ...wrapper, 
        width: width != undefined ? width + 'px' : '', 
        height: height != undefined ? height+'px' : ''
    }
    cardStyle = {...containerStyle, ...cardStyle};

    const togglePanelButton = () => {
        return canToggleVisibility &&
            (
                <div style={{...panelOpenStyle, backgroundColor: panelOpen ? 'lightgrey' : "#284760"}}>
                    <IconButton onClick={() => setIsPanelOpen(!panelOpen)} style={{top: "50%", left: "50%", transform: "translate(-50%, -50%)"}}>
                        <VisibilityIcon style={{color: 'white'}}/>
                    </IconButton>
                </div>
            );
    }

    return (
        <Draggable position={initPosition} {...dragHandlers} onDrag={onControlledDrag}>
            <div style={{...cardStyle, cursor: isDraggable ? 'move' : ''}}>
                <div style={{width: '100%', height: '100%', padding: '10px', ...innerStyle}} className="cardContent">
                    { togglePanelButton() }
                    { panelOpen && title && <h1 style={{margin: '10px 0px 20px', fontSize: '1.6rem', textAlign: 'center'}}>{title}</h1> }
                    { panelOpen && children }
                </div>
            </div>
        </Draggable>
    )
};

export default Card;