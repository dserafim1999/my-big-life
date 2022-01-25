import React from "react";
import ReactDom from "react-dom";

import { createStore } from 'redux'
import { Provider } from 'react-redux'

import App from "./App";
import reducers from "../src/reducers";

import "./App.css";

let store = createStore(reducers);

export default store;

ReactDom.render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('app'));
