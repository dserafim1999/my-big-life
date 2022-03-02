import React, { Component } from "react";

import Draggable from 'react-draggable';

const wrapper = {
    position: 'fixed',
    width: '375px',
    backgroundColor: 'white',
    borderRadius: '15px',
    zIndex: '1000'
}

export default class Card extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        const { children } = this.props;

        return (
            <Draggable>
                <div style={wrapper}>
                    <div style={{width: '100%', height: '100%', padding: '10px'}} >
                        { children }
                    </div>
                </div>
            </Draggable>
        )
    }
};
