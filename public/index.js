import React from "react";
import ReactDom from "react-dom";

import { Provider } from 'react-redux';
import { Map } from 'immutable';

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import App from "./App";
import reducers from "../src/reducers";

import "./App.css";

const loggerMiddleware = createLogger();

let store = createStore(
  reducers,
  Map({}),
  applyMiddleware(thunk, loggerMiddleware),
);


ReactDom.render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('app'));
