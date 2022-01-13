import styled from "styled-components";

export const Wrapper = styled.div`
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

export const Content = styled.div`
    width: 100%;
    height: 100%;

    padding: 20px;
`;