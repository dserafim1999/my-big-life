import React, { useState } from "react";

import Draggable from 'react-draggable';
import useWindowDimensions from "../../utils";

const wrapper = {
    position: 'fixed',
    backgroundColor: 'white',
    borderRadius: '15px',
    zIndex: '1000'
}

const Card = ({ width, verticalOffset, horizontalOffset, children, isDraggable = true }) => {
    const innerWidth = window.innerWidth - width;
    const innerHeight = window.innerHeight;

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

    const cardStyle =  {...wrapper, width: width+"px"}

    return (
        <Draggable position={initPosition} {...dragHandlers} onDrag={onControlledDrag}>
            <div style={cardStyle}>
                <div style={{width: '100%', height: '100%', padding: '10px'}}>
                    { children }
                </div>
            </div>
        </Draggable>
    )
};

export default Card;