import React from "react";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { connect } from 'react-redux'

import MainContainer from './MainContainer';
import MenuBar from '../components/MenuBar';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';

import { toggleRemainingTracks } from '../actions/general';
import { undo, redo, nextStep, previousStep, skipDay } from '../actions/process';
import { ModuleRoutes } from "../modules/ModuleRoutes";

let App = ({ showConfig, view, dispatch }) => {
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
            <MenuBar dispatch={dispatch}/>
            <MainContainer
              onKeyUp={keyHandler}
              onKeyDown={downKeyHandler}
              showConfig={showConfig}
              view={view}
            />
          </Router>
    </LocalizationProvider>
  );
};

const mapStateToProps = (state) => ({
  view: state.get('general').get('activeView')
});

export default connect(mapStateToProps)(App);