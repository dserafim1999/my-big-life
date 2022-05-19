import React from "react";

<<<<<<< Updated upstream
import styled from "styled-components";

const Wrapper = styled.div`
    position: absolute;
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    background-color: white;
    border-radius: 15px;
    
    z-index: 500;
    top: ${props => props.top}%;
    left: ${props => props.left}%;
    transform: translate(-${props => props.top}%, -${props => props.left}%);
`;
=======
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
>>>>>>> Stashed changes

const Content = styled.div`
    width: 100%;
    height: 100%;

    padding: 10px;
`;

<<<<<<< Updated upstream
const Card = (props) => {
    const { children, width, height, top, left, content } = props;

    return (
        <Wrapper width={width} height={height} top={top} left={left}>
            <Content>
              { children }
            </Content>
        </Wrapper>
=======
    const cardStyle =  {...wrapper, width: width != null ? width+'px' : '', height: height != null ? height+'px' : ''}

    return (
        <Draggable position={initPosition} {...dragHandlers} onDrag={onControlledDrag}>
            <div style={cardStyle}>
                <div style={{width: '100%', height: '100%', padding: '10px'}} className="cardContent">
                    { children }
                </div>
            </div>
        </Draggable>
>>>>>>> Stashed changes
    )
};

export default Card;