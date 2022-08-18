import React, { useState } from "react";

import IconButton from "@mui/material/IconButton";
import { ModuleRoutes } from "../../modules/ModuleRoutes";
import { connect } from "react-redux";
import { toggleUI as toggleUIAction, updateView } from "../../actions/general";
import { MAIN_VIEW } from "../../constants";
import { Tooltip } from "@mui/material";
import { useNavigate } from "react-router-dom";

import HideUIIcon from "@mui/icons-material/VisibilityOff";
import ShowUIIcon from "@mui/icons-material/Menu";
import { routeTo } from "../../reducers/utils";

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
    let navigate = useNavigate();

    const isActiveView = (view) => {
        return activeView === view;
    }

    const toggleUI = (value) => {
        dispatch(toggleUIAction(value));
        setIsPanelOpen(value);
    }

    const renderOpenMenu = () => {
        return (
            <>
                <div style={{borderRight: "2px solid lightgrey"}}>    
                    {
                        ModuleRoutes.map(menu => (
                            <Tooltip key={menu.id} title={menu.title}> 
                                <IconButton 
                                    size="small" 
                                    aria-label={menu.title}
                                    onClick={() => dispatch(isActiveView(menu.view) ? updateView(MAIN_VIEW, routeTo(activeView, MAIN_VIEW), navigate) : updateView(menu.view, routeTo(activeView, menu.view), navigate))}
                                    className={isActiveView(menu.view) ? 'activeIcon' : 'inactiveIcon'}
                                >  
                                    {menu.icon}
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