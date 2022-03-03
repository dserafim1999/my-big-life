import React, { useState } from "react";
import { Link } from "react-router-dom";

import Stack from 'react-bootstrap/Stack';
import { getActiveRoute, isEquals } from "../../utils";

import IconButton from "@mui/material/IconButton";
import { ModuleRoutes } from "../../modules/ModuleRoutes";


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

const SideBar = () => {
    const [activeRoute, setActiveRoute] = useState('/');

    return (
        <div style={wrapper}>
            <Stack direction="horizontal" gap={ModuleRoutes.length}>
            {
                ModuleRoutes.map(menu => (
                    <IconButton 
                        key={menu.id}
                        size="small" 
                        aria-label={menu.title}
                        onClick={() => setActiveRoute(getActiveRoute())}
                        className={isEquals(activeRoute, menu.route) ? 'activeIcon' : 'inactiveIcon'}
                    >  
                        <Link to={isEquals(activeRoute, menu.route) ? '/' : menu.route}>{menu.icon}</Link>
                    </IconButton>
                ))
            
            }
            </Stack>
        </div>
    )
};

export default SideBar;