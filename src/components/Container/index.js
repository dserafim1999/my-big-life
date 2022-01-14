import React from "react";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Map from "../../containers/Map";
import SideBar from "../SideBar";

import { FeaturesData } from "../SideBar/FeaturesData";

const Container = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<SideBar/>}/>
                    {
                    FeaturesData.map(menu => (
                        <Route 
                        key={menu.id}
                        path={menu.route} 
                        element={menu.component}
                        />
                    ))
                    }
                <Route path='/*' element={<></>}/>
            </Routes>

            <SideBar/>
            <Map
            center={[50, 25]}
            zoom={4} 
            scroll={true} 
            />
        </Router>
    )
};

export default Container;