import React from "react";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { connect } from 'react-redux'

import Map from "../../containers/Map";

import SideBar from "../SideBar";
import Dropzone from "../Dropzone";
import TrackList from "../TrackProcessing/TrackList";

import { addTrack } from '../../actions';
import { loadFiles } from "../../utils.js";

import { FeaturesData } from "../SideBar/FeaturesData";


let Container = ({ tracks, dispatch }) => {
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

  let a = tracks.map((track) => track.segments.filter((segment) => segment.display));

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
                  center={[50, 25]}
                  zoom={4} 
                  scroll={true}
                  tracks={a} 
              />
          </Router>
      </Dropzone>
  );
};

const mapStateToProps = (state) => {
  console.log(state.tracks)
    return {
        tracks: state.tracks
      }
  }
  
Container = connect(mapStateToProps)(Container);

export default Container;