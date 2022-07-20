import { FeatureGroup } from 'leaflet';
import { createLocationMarker } from '../utils';

export default (location, color) => {
  const point = {lat: location.get('lat'), lon: location.get('lon'), label: location.get('label')};
  const marker = createLocationMarker(point, color);
  const layergroup = new FeatureGroup([marker]);

  // add location
  const obj = {
    layergroup,
    marker: marker,
    details: new FeatureGroup()
  };

  return obj;
}
