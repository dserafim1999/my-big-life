import React from "react"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Map  from "./components/Map";
import SideBar from "./components/SideBar";

import { FeaturesData } from "./components/SideBar/FeaturesData";

import "./App.css"
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => (
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

    <SideBar/>
    <Map
      center={[50, 25]}
      zoom={4} 
      scroll={true} 
    />
  </Router>
);

export default App