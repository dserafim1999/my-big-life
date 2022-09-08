import React from "react";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { connect } from 'react-redux'

import MainContainer from './components/MainContainer';
import Dropzone from './components/Dropzone';
import MenuBar from './components/MenuBar';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';

import { addAlert, uploadFile } from './actions/general';
import { undo, redo, nextStep, previousStep, skipDay, toggleRemainingTracks } from './actions/process';
import { ModuleRoutes } from "./modules/ModuleRoutes";
import loadFiles from "./utils/loadFiles";
import { TRACK_PROCESSING } from "./constants";
import LoadingOverlay from "./components/Overlay/LoadingOverlay";

let App = ({ showConfig, view, canDropFiles, isAppLoading, dispatch }) => {
  let metaDown = false;

  const onDrop = (e) => {
    let dt = e.dataTransfer;
    let files = dt.files;

    loadFiles(files, (file) => {
      dispatch(uploadFile(file));
      dispatch(toggleRemainingTracks(true));
    }, () => dispatch(addAlert('Unsupported file type.', 'error', 5, 'config-err')));
  }

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
    <LocalizationProvider dateAdapter={AdapterMoment}>
        <Router>
            <Routes>
                <Route path='/' element={<></>}/>
                    {
                      ModuleRoutes.map(menu => {
                          if (menu.route) {
                            return <Route 
                              key={menu.id}
                              path={menu.route} 
                              element={menu.component}
                            />
                          }
                        }
                      )
                    }
                <Route path='/*' element={<></>}/> 
            </Routes>
            {
              // Shows components for active view that don't have a dedicated route (over the main view)
              ModuleRoutes.map(menu => {
                if (!menu.route && menu.view === view) {
                  return menu.component;
                }
              })
            }
            <Dropzone onDrop={onDrop} canDropFiles={canDropFiles}>
              { isAppLoading && <LoadingOverlay/>}
              <MenuBar dispatch={dispatch}/>
              <MainContainer
                onKeyUp={keyHandler}
                onKeyDown={downKeyHandler}
                showConfig={showConfig}
                view={view}
              />
            </Dropzone>
          </Router>
    </LocalizationProvider>
  );
};

const mapStateToProps = (state) => ({
  view: state.get('general').get('activeView'),
  canDropFiles: state.get('general').get('activeView') === TRACK_PROCESSING && !state.get('process').get('isBulkProcessing'),
  isAppLoading: state.get('general').get('isAppLoading')
});

export default connect(mapStateToProps)(App);