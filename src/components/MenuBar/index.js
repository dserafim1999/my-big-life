import React, { useState } from "react";
import { Link } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import { getRoute, ModuleRoutes } from "../../modules/ModuleRoutes";
import { connect } from "react-redux";
import { toggleUI as toggleUIAction, updateView } from "../../actions/general";
import { MAIN_VIEW } from "../../constants";
import { Tooltip } from "@mui/material";

import HideUIIcon from "@mui/icons-material/VisibilityOff";
import ShowUIIcon from "@mui/icons-material/Menu";

const wrapperStyle = {
    position: 'absolute',
    padding: '10px 15px 10px 15px',
    backgroundColor: 'white',
    borderRadius: '50px',
    zIndex: '500',
    left: '50%',
    bottom: '10px',
    transform: 'translate(-50%, 0%)',
    display: 'flex'
}

const MenuBar = ({dispatch, activeView, isVisible}) => {
    const [panelOpen, setIsPanelOpen] = useState(true);

    const isActiveView = (view) => {
        return activeView === view;
    }

    const routeTo = (view) => {
        const route = getRoute(view);
        
        return isActiveView(view) ? '/' : route;
    }

    const toggleUI = (value) => {
        dispatch(toggleUIAction(value));
        setIsPanelOpen(value);
    }

    const renderOpenMenu = () => {
        return (
            <>
                <div style={{borderRight: "1px solid lightgrey"}}>    
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
                <Tooltip title={"Hide UI"}> 
                    <IconButton 
                        size="small" 
                        onClick={() => toggleUI(false)}
                        className="inactiveIcon"
                    >  
                        <HideUIIcon fontSize="large"/>
                    </IconButton>
                </Tooltip>
            </>
        );
    }

    const renderShowUIButton = () => {
        return (
            <Tooltip title={"Show UI"}>
                <IconButton 
                    size="small" 
                    onClick={() => toggleUI(true)}
                    className="inactiveIcon"
                >  
                        <ShowUIIcon/>
                </IconButton>
            </Tooltip>
        );
    }
         
    return (
        <div style={wrapperStyle}>
            { panelOpen ?
                renderOpenMenu() :
                renderShowUIButton()
            }
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        activeView: state.get('general').get('activeView'),
        isVisible: state.get('general').get('isUIVisible')
    };
  }
  
export default connect(mapStateToProps)(MenuBar);