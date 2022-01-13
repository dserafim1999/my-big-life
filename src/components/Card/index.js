import React from "react";

import { Wrapper, Content } from "./Card.styles";

const Card = ({width, height, top, left, content}) => {
    console.log(width);
    return (
        <Wrapper width={width} height={height} top={top} left={left}>
            <Content>
              { content }
            </Content>
        </Wrapper>
    )
};

export default Card;