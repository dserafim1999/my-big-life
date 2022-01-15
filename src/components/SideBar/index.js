import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import Stack from 'react-bootstrap/Stack';
import { getActiveRoute, isEquals } from "../../utils";

import IconButton from "@mui/material/IconButton";
import { FeaturesData } from "./FeaturesData";


const Wrapper = styled.div`
    position: absolute;
    padding: 20px 15px 20px 15px;
    background-color: white;
    border-radius: 50px;
    
    z-index: 500;
    top: 50%;
    left: 10px;
    transform: translate(0%, -50%);

    .active {
        a {
            color: black;
        }
    }

    .inactive {
        a {
            color: grey;
        }
    }
`;

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