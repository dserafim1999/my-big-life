import React from "react";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { connect } from 'react-redux'

import Map from "../../containers/Map";
import SideBar from "../SideBar";
import Dropzone from "../Dropzone";
import { addTrack } from '../../actions';
import { loadFiles } from "../../utils.js";

import { FeaturesData } from "../SideBar/FeaturesData";


let Container = ({dispatch}) => {
    const onDrop = (e) => {
      let dt = e.dataTransfer;
      let files = dt.files;
    
      loadFiles(files, (gpx)=>{
        const tracks = gpx.trk.map((trk) => {
          dispatch(addTrack(trk.trkseg.map((seg) => {
            return seg.trkpt;
          })))
        })
      });
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

const mapStateToProps = (state) => {
    console.log("State:");
    console.log(state);
  }
  
Container = connect(mapStateToProps)(Container);

export default Container;