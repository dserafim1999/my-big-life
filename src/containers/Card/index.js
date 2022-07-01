import React, { useState } from "react";

import Draggable from 'react-draggable';

const wrapper = {
    position: 'fixed',
    backgroundColor: 'white',
    borderRadius: '15px',
    zIndex: '1000'
}

const Card = ({ width, height, verticalOffset, horizontalOffset, children, isDraggable = true, style }) => {
    const innerWidth = width != undefined ? window.innerWidth - width : window.innerWidth;
    const innerHeight = height != undefined ? window.innerHeight - height : window.innerHeight;

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

    var cardStyle =  {
        ...wrapper, 
        width: width != undefined ? width + 'px' : '', 
        height: height != undefined ? height+'px' : ''
    }
    cardStyle = style ? {...cardStyle, ...style} : cardStyle;

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