import React from "react";

import { connect } from 'react-redux'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { addAlert, uploadFile } from './actions/general';
import { undo, redo, nextStep, previousStep, skipDay, toggleRemainingTracks } from './actions/process';
import { ModuleRoutes } from "./modules/ModuleRoutes";
import { TRACK_PROCESSING } from "./constants";

import Dropzone from './components/Dropzone';
import MenuBar from './components/MenuBar';
import loadFiles from "./utils/loadFiles";
import LoadingOverlay from "./components/Overlay/LoadingOverlay";
import AlertBox from "./components/AlertBox";
import StatefulMap from "./modules/StatefulMap";

let App = ({ view, canDropFiles, isAppLoading, dispatch }) => {
  const onDrop = (e) => {
    let dt = e.dataTransfer;
    let files = dt.files;

    loadFiles(files, (file) => {
      dispatch(uploadFile(file));
      dispatch(toggleRemainingTracks(true));
    }, () => dispatch(addAlert('Unsupported file type.', 'error', 5, 'config-err')));
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
              <div id='container'> 
                <AlertBox/>
                <StatefulMap/>
              </div>
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