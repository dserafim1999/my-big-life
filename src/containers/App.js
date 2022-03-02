import React from "react";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { connect } from 'react-redux'

import Dropzone from "../components/Dropzone";
import MainContainer from './MainContainer';
import SideBar from '../components/SideBar';


import { addMultipleTracks } from '../actions/tracks';
import { loadFiles } from "../GPXParser";

import { toggleRemainingTracks, toggleConfig } from '../actions/ui';
import { undo, redo, nextStep, previousStep, skipDay } from '../actions/progress';
import { FeaturesData } from "../components/SideBar/FeaturesData";

let App = ({ showConfig, step, dispatch }) => {

  const onDrop = (e) => {
    let dt = e.dataTransfer
    let files = dt.files

    loadFiles(files, (tracks) => {
      const r = tracks.map((track) => {
        const { gpx, name } = track
        return {
          segments: gpx.trk.map((trk) => trk.trkseg.map((seg) => seg.trkpt)),
          name
        }
      })
      dispatch(addMultipleTracks(r));
    });

  }

  let metaDown = false
  const downKeyHandler = (event) => {
    const { keyCode } = event;
    const key = String.fromCharCode(event.keyCode);

    if (event.ctrlKey || metaDown) {
      switch (key) {
        case 'Y': return dispatch(redo());
        case 'Z': return dispatch(undo());
        case 'F':
          if (step === 0) {
            return dispatch(skipDay());
          } else {
            return dispatch(previousStep());
          }
        case 'G': return dispatch(nextStep());
        case 'I': return dispatch(toggleRemainingTracks());
      }
    }
    metaDown = (keyCode === 91 || keyCode === 224 || keyCode === 17);
  }

  const keyHandler = (event, e2) => {
    const { keyCode } = event;
    if (metaDown && (keyCode === 91 || keyCode === 224 || keyCode === 17)) {
      metaDown = false;
    }
  }

  return (
      <Dropzone id="container" onDrop={onDrop}>
        <Router>
            <Routes>
                <Route path='/' element={<></>}/>
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
            <MainContainer
              onKeyUp={keyHandler}
              onKeyDown={downKeyHandler}
              showConfig={showConfig}
              step={step} 
            />
          </Router>
      </Dropzone>
  );
};

const mapStateToProps = (state) => ({
  step: state.get('progress').get('step')
});

export default connect(mapStateToProps)(App);