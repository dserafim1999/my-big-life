import React from "react";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { connect } from 'react-redux'

import Map from "../Map";

import SideBar from "../../components/SideBar";
import Dropzone from "../../components/Dropzone";

import ConfigPane from '../ConfigPane';

import { addMultipleTracks } from '../../actions/tracks';
import { loadFiles } from "../../GPXParser";

import { FeaturesData } from "../../components/SideBar/FeaturesData";
import AlertBox from "../AlertBox";

import { undo, redo } from '../../actions/progress';
import SidePane from "../SidePane";

let MainContainer = ({ showConfig, dispatch, step }) => {
  
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
    const { keyCode } = event
    metaDown = (keyCode === 91 || keyCode === 224 || keyCode === 17)
  }

  const keyHandler = (event, e2) => {
    const { keyCode } = event
    const key = String.fromCharCode(event.keyCode)
    if ((event.ctrlKey || metaDown) && key === 'Z') {
      dispatch(undo())
    } else if ((event.ctrlKey || metaDown) && key === 'Y') {
      dispatch(redo())
    } else if (keyCode === 91 || keyCode === 224 || keyCode === 17) {
      metaDown = false
    }
  }

  return (
      <Dropzone id="container" onDrop={onDrop}>
          <Router>
            {/*
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
              */
            }
              <div id='container' onKeyUp={keyHandler} onKeyDown={downKeyHandler} > 
                <AlertBox/>
                {
                //<SideBar/>}
                }
                <SidePane/>
                <Map/>
              </div>
              { showConfig ? <ConfigPane /> : null }
          </Router>
      </Dropzone>
  );
};

const mapStateToProps = (state) => {
  return {
    step: state.get('progress').get('step'),
    showConfig: state.get('ui').get('showConfig')
  }
}
  
MainContainer = connect(mapStateToProps)(MainContainer);

export default MainContainer;