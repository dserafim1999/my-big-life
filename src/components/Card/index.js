import React from "react";

import styled from "styled-components";

const Wrapper = styled.div`
    position: absolute;
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    background-color: white;
    border-radius: 25px;
    
    z-index: 500;
    top: ${props => props.top}%;
    left: ${props => props.left}%;
    transform: translate(-${props => props.top}%, -${props => props.left}%);
`;

const Content = styled.div`
    width: 100%;
    height: 100%;

    padding: 10px;
`;

const Card = (props) => {
    const { children, width, height, top, left, content } = props;

    return (
        <Wrapper width={width} height={height} top={top} left={left}>
            <Content>
              { children }
            </Content>
        </Wrapper>
    )
};

export default Card;