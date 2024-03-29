import React from "react";
import ReactDom from "react-dom";

import '../node_modules/bulma/css/bulma.css';
import "./App.css";

import { Provider } from 'react-redux';

import App from "../src/App";
import store from '../src/store';

import "./App.css";
  
ReactDom.render((
    <Provider store={store}>
      <App />
    </Provider>
), document.getElementById('app'));
