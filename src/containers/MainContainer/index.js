import React from "react";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { connect } from 'react-redux'

import Map from "../Map";

import SideBar from "../../components/SideBar";
import Dropzone from "../../components/Dropzone";

import { addMultipleTracks } from '../../actions/tracks';
import { loadFiles } from "../../GPXParser";

import { FeaturesData } from "../../components/SideBar/FeaturesData";
import AlertBox from "../AlertBox";

import { nextStep, undo, redo } from '../../actions/progress';
import Progress from '../Progress';

let MainContainer = ({ dispatch }) => {
  
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

  const onNext = (e) => {
    dispatch(nextStep())
      .then(() => {
        console.log('hey')
      })
  }

  const onPrevious = (e) => {
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
      <Dropzone id="container" onDrop={onDrop} onKeyUp={keyHandler} onKeyDown={downKeyHandler}>
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
              <Progress onNext={ onNext } onPrevious={ onPrevious } />
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