import React, { useState } from "react";

import Draggable from 'react-draggable';

const wrapper = {
    position: 'fixed',
    backgroundColor: 'white',
    borderRadius: '15px',
    zIndex: '1000'
}

const Card = ({ width, height=null, verticalOffset, horizontalOffset, children, isDraggable = true }) => {
    const innerWidth = width != null ? window.innerWidth - width : window.innerWidth;
    const innerHeight = height != null ? window.innerHeight - height : window.innerHeight;

    var initState = {
        controledPosition: {
            x: innerWidth * horizontalOffset/100, y: innerHeight * verticalOffset/100 
        }
    }

    const [ state, setState ] = useState(initState)

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

    const cardStyle =  {...wrapper, width: width != null ? width+'px' : '', height: height != null ? height+'px' : ''}

    return (
        <Draggable position={initPosition} {...dragHandlers} onDrag={onControlledDrag}>
            <div style={cardStyle}>
                <div style={{width: '100%', height: '100%', padding: '10px'}} className="cardContent">
                    { children }
                </div>
            </div>
        </Draggable>
    )
};

export default Card;