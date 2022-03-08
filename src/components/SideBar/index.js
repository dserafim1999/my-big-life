import React, { Component } from "react";
import { Link } from "react-router-dom";

import Stack from 'react-bootstrap/Stack';

import IconButton from "@mui/material/IconButton";
import { getRoute, ModuleRoutes } from "../../modules/ModuleRoutes";
import { connect } from "react-redux";
import { updateView } from "../../actions/general";
import { MAIN_VIEW } from "../../constants";


const wrapper = {
    position: 'absolute',
    padding: '10px 15px 10px 15px',
    backgroundColor: 'white',
    borderRadius: '50px',
    zIndex: '500',
    left: '50%',
    bottom: '10px',
    transform: 'translate(-50%, 0%)'
}

class SideBar extends Component {

    constructor(props) {
        super(props);
    }
    
    componentDidMount () {
    }

    isActiveView(view) {
        const { activeView } = this.props;
        return activeView === view;
    }

    routeTo(view) {
        const route = getRoute(view);
        
        return this.isActiveView(view) ? '/' : route;
    }

    render() {
        const { dispatch } = this.props;

        return (
            <div style={wrapper}>
                <Stack direction="horizontal" gap={ModuleRoutes.length}>
                {
                    ModuleRoutes.map(menu => (
                        <IconButton 
                            key={menu.id}
                            size="small" 
                            aria-label={menu.title}
                            onClick={() => dispatch(this.isActiveView(menu.view) ? updateView(MAIN_VIEW) : updateView(menu.view))}
                            className={this.isActiveView(menu.view) ? 'activeIcon' : 'inactiveIcon'}
                        >  
                            <Link to={this.routeTo(menu.view)}>{menu.icon}</Link>
                        </IconButton>
                    ))
                
                }
                </Stack>
            </div>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        activeView: state.get('general').get('activeView')
    };
  }
  
SideBar = connect(mapStateToProps)(SideBar);

export default SideBar;