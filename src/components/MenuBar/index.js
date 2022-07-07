import React from "react";
import { Link } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import { getRoute, ModuleRoutes } from "../../modules/ModuleRoutes";
import { connect } from "react-redux";
import { loadTrips, updateView } from "../../actions/general";
import { MAIN_VIEW } from "../../constants";
import { getActiveRoute } from "../../utils";
import { Tooltip } from "@mui/material";


const wrapperStyle = {
    position: 'absolute',
    padding: '10px 15px 10px 15px',
    backgroundColor: 'white',
    borderRadius: '50px',
    zIndex: '500',
    left: '50%',
    bottom: '10px',
    transform: 'translate(-50%, 0%)'
}

const MenuBar = ({dispatch, activeView}) => {
    const isActiveView = (view) => {
        return activeView === view;
    }

    const routeTo = (view) => {
        const route = getRoute(view);
        
        return isActiveView(view) ? '/' : route;
    }
         
    if (getActiveRoute() === '/') {
        dispatch(loadTrips());
    }

    return (
        <div style={wrapperStyle}>
            {
                ModuleRoutes.map(menu => (
                    <Tooltip key={menu.id} title={menu.title}> 
                        <IconButton 
                            size="small" 
                            aria-label={menu.title}
                            onClick={() => dispatch(isActiveView(menu.view) ? updateView(MAIN_VIEW) : updateView(menu.view))}
                            className={isActiveView(menu.view) ? 'activeIcon' : 'inactiveIcon'}
                        >  
                            <Link to={routeTo(menu.view)}>{menu.icon}</Link>
                        </IconButton>
                    </Tooltip>
                ))
            
            }
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        activeView: state.get('general').get('activeView')
    };
  }
  
export default connect(mapStateToProps)(MenuBar);