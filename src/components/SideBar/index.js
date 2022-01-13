import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Wrapper } from "./SideBar.styles";
import Stack from 'react-bootstrap/Stack';
import { getActiveRoute, isEquals } from "../../../utils";

import IconButton from "@mui/material/IconButton";
import { FeaturesData } from "./FeaturesData";

const SideBar = () => {
    const [activeRoute, setActiveRoute] = useState('/');

    return (
        <Wrapper>
            <Stack gap={FeaturesData.length}>
            {
                FeaturesData.map(menu => (
                    <IconButton 
                        key={menu.id}
                        size="small" 
                        aria-label={menu.title}
                        onClick={() => setActiveRoute(getActiveRoute())}
                        className={isEquals(activeRoute, menu.route) ? 'active' : 'inactive'}
                    >  
                        <Link to={isEquals(activeRoute, menu.route) ? '/' : menu.route}>{menu.icon}</Link>
                    </IconButton>
                ))
            
            }
            </Stack>
        </Wrapper>
    )
};

export default SideBar;