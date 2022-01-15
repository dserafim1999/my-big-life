import React from "react";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Map from "../../containers/Map";
import SideBar from "../SideBar";
import Dropzone from "../Dropzone";

import { loadFiles } from "../../utils.js";

import { FeaturesData } from "../SideBar/FeaturesData";


const Container = () => {
    const onDrop = (e) => {
      let dt = e.dataTransfer;
      let files = dt.files;
    
      console.log("Loaded File:");
      loadFiles(files, (gpx)=>{
          console.log(gpx);
      })
    }

    return (
        <Dropzone id="container" onDrop={onDrop}>
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
        </Dropzone>
    );
};

export default Container;