import React from 'react';
import { TileLayer } from 'leaflet';

export default (map) => {
  var osmUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
  var osm = new TileLayer(osmUrl, {attribution: osmAttrib, detectRetina: true, maxZoom: 22, maxNativeZoom: 18});
  
  map.addLayer(osm);
}
