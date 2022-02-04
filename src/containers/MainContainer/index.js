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


let MainContainer = ({ ui, tracks, dispatch }) => {
  
  const onDrop = (e) => {
    let dt = e.dataTransfer
    let files = dt.files

    loadFiles(files, (gpx, file) => {
      gpx.trk.forEach((trk) => {
        const trackPoints = trk.trkseg.map((seg) => seg.trkpt)
        dispatch(addTrack(trackPoints, file))
      })
    })
  }

  let filteredTracks = tracks.map((track) => track.segments.filter((segment) => segment.display));

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
              <div id='details'>
                {tracks.length > 0 ? <TrackList tracks={tracks} dispatch={dispatch} /> : <></>}
              </div>
              <Map
                  bounds={ui.bounds}
                  tracks={filteredTracks} 
                  dispatch={dispatch}
              />
          </Router>
      </Dropzone>
  );
};

const mapStateToProps = (state) => {
    return {
        tracks: state.tracks,
        ui: state.ui
      }
  }
  
MainContainer = connect(mapStateToProps)(MainContainer);

export default MainContainer;