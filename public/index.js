import React from "react";
import ReactDom from "react-dom";

import '../node_modules/bulma/css/bulma.css';

import { Provider } from 'react-redux';
import { Map } from 'immutable';

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { requestServerState } from '../src/actions/progress';

import App from "./App";
import reducers from "../src/reducers";

import "./App.css";

const loggerMiddleware = createLogger({
  stateTransformer: (state) => state.toJS()
});

let store = createStore(
  reducers,
  Map({}),
  applyMiddleware(thunk, loggerMiddleware),
);
  
store.dispatch(requestServerState());
  
ReactDom.render((
    <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('app'));
