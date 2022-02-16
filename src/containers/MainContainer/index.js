import React from "react";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { connect } from 'react-redux'

import Map from "../Map";

import SideBar from "../../components/SideBar";
import Dropzone from "../../components/Dropzone";
import TrackList from "../TrackList";

import { addTrack } from '../../actions/tracks';
import { loadFiles } from "../../GPXParser";

import { FeaturesData } from "../../components/SideBar/FeaturesData";
import AlertBox from "../AlertBox";


let MainContainer = ({ dispatch }) => {
  
  const onDrop = (e) => {
    let dt = e.dataTransfer
    let files = dt.files

    loadFiles(files, (gpx, file) => {
      gpx.trk.forEach((trk) => {
        const trackPoints = trk.trkseg.map((seg) => seg.trkpt)
        dispatch(addTrack(trackPoints, file))
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
              <AlertBox/>
              <SideBar/>
              <div id='details'>
                <TrackList/>
              </div>
              <Map/>
          </Router>
      </Dropzone>
  );
};

const mapStateToProps = (state) => {
    return {}
  }
  
MainContainer = connect(mapStateToProps)(MainContainer);

export default MainContainer;