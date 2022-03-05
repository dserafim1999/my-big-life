import React, { Component } from "react";
import { Link } from "react-router-dom";

import Stack from 'react-bootstrap/Stack';
import { getActiveRoute, isEquals } from "../../utils";

import IconButton from "@mui/material/IconButton";
import { ModuleRoutes } from "../../modules/ModuleRoutes";
import { loadTrips } from "../../actions/general";


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

        this.state = {
            route: getActiveRoute()
        }
    }
    
    setActiveRoute() {
        this.setState({
            route: getActiveRoute()
        });
    }
    
    componentDidMount () {        
        this.setActiveRoute();
    }

    isEqualRoute(route) {
        return isEquals(this.state.route, route);
    }

    render() {
        const { dispatch } = this.props;

        if (this.isEqualRoute('/')) {
            dispatch(loadTrips());
        }

        return (
            <div style={wrapper}>
                <Stack direction="horizontal" gap={ModuleRoutes.length}>
                {
                    ModuleRoutes.map(menu => (
                        <IconButton 
                            key={menu.id}
                            size="small" 
                            aria-label={menu.title}
                            onClick={() => this.setActiveRoute()}
                            className={this.isEqualRoute(menu.route) ? 'activeIcon' : 'inactiveIcon'}
                        >  
                            <Link to={this.isEqualRoute(menu.route) ? '/' : menu.route}>{menu.icon}</Link>
                        </IconButton>
                    ))
                
                }
                </Stack>
            </div>
        )
    }
};

export default SideBar;