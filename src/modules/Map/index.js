import React, { Component } from 'react';
import setupTileLayers from './components/setupTileLayers';
import setupControls from './components/setupControls';
import editMode from './editing/editMode';
import joinMode from './editing/joinMode';
import splitMode from './editing/splitMode';
import updatePoints from './point/updatePoints';
import pointActionMode from './editing/pointActionMode';
import detailMode from './point/detailMode';
import addSegment from './components/addSegment';
import addLocation from './components/addLocation';
import moment from 'moment';
import "leaflet.heat";

import { map, latLngBounds } from 'leaflet';
import { Set } from 'immutable';
import { findDOMNode } from 'react-dom';
import {
  extendSegment,
  splitSegment,
  changeSegmentPoint,
  addSegmentPoint,
  removeSegmentPoint,
  joinSegment
} from '../../actions/segments';
import { undo, redo } from '../../actions/process';
import { clearTrips, canLoadMoreTripsInBounds, loadTripsInBounds } from '../../actions/trips';
import { MAIN_VIEW, MAP_DECORATION_ZOOM_LEVEL, MAP_DETAIL_ZOOM_LEVEL, TRACK_PROCESSING, VISUAL_QUERIES } from '../../constants';
import { createMarker, createPointIcon } from './utils';
import { setZoomLevel } from '../../actions/map';
import { setSelectedDay } from '../../actions/general';

const DEFAULT_PROPS = {
  detailLevel: MAP_DETAIL_ZOOM_LEVEL,
  decorationLevel: MAP_DECORATION_ZOOM_LEVEL,
  mapCreation: {
    zoomControl: false,
    zoomDelta: 0.4,
    zoomSnap: 0.4,
    minZoom: 2,
    maxBounds: new L.LatLngBounds([[90,-200],[-90,200]]),
    maxBoundsViscosity: 1
  },
  segmentsAreMarkers: true
}

export default class LeafletMap extends Component {
  constructor (props) {
    super(props);

    this.map = undefined;
    this.mapRef = React.createRef(); 

    /**
     * Holds the segments currently displayed in their leaflet form
     *  key: segment id
     *  value: object of
     *    {
     *      layergroup: what is being displayed, this element is added and
     *      polyline: the polyline that represents the segment
     *      points: a marker for each point
     *      tearDown: undos the changes made by the different modes,
     *        it should put the map in the initial state
     *    }
     *    this should be reconstructed each time there is an update to the points or the visualization mode.
     */
    this.trips = {};
    this.segments = {};
    this.canonical = {};
    this.locations = {};
    this.pointHighlights = [];
    this.heatmapLayer = null;
    this.state = {loadTrips: true};
  }

  getBoundsObj () {
    const { fitBounds } = this.props;
    if (typeof fitBounds === 'function') {
      return fitBounds();
    } else {
      return fitBounds;
    }
  }

  fitBounds (where) {
    const { dispatch } = this.props;
    this.map.fitBounds(where, {
      maxZoom: this.map.getBoundsZoom(where, true),
      ...this.getBoundsObj()
    });
    dispatch(setZoomLevel(this.map.getBoundsZoom(where, true)))
  }

  fitWorld () {
    this.map.fitWorld(this.getBoundsObj());
  }

  componentDidMount () {
    const { mapCreation, dispatch } = this.props;
    const m = findDOMNode(this.mapRef.current);
    this.map = map(m, mapCreation);

    setupTileLayers(this.map);

    setupControls(this.map, {
      canUndo: this.props.canUndo,
      canRedo: this.props.canRedo,
      undo: () => dispatch(undo()),
      redo: () => dispatch(redo()),
    });

    this.fitWorld();
    
    this.map.on('zoomend', this.onZoomEnd.bind(this));
    this.map.on('dragend', this.onMoveEnd.bind(this));
  }

  componentWillUnmount () {
    this.map.remove();
  }

  componentDidUpdate (prev) {
    if (!this.map) {
      return;
    }
    
    const {
      center,
      bounds,
      zoom,
      highlighted,
      highlightedPoints,
      segments,
      trips,
      canonicalTrips,
      locations,
      activeView,
      canUndo,
      canRedo,
      pointPrompt,
    } = this.props;

    if (canUndo !== prev.canUndo) {
      this.map.buttons.setEnabled(0, canUndo);
    }

    if (canRedo !== prev.canRedo) {
      this.map.buttons.setEnabled(1, canRedo);
    }

    this.shouldUpdateCanonicalTrips(canonicalTrips, prev.canonicalTrips);
    this.shouldUpdateLocations(locations, prev.locations);
    this.shouldUpdateTrips(trips, prev.trips);
    this.shouldUpdateSegments(segments, prev.segments);
    this.shouldUpdateZoom(zoom, prev.zoom);
    this.shouldUpdateCenter(center, prev.center);
    this.shouldUpdateBounds(bounds, prev.bounds);
    this.shouldUpdateHighlighted(highlighted, prev.highlighted, segments);
    this.shouldUpdateHighlightedPoints(highlightedPoints, prev.highlightedPoints, segments);
    this.shouldUpdatePrompt(pointPrompt, prev.pointPrompt);
    this.shouldUpdateSegmentsArePoints(this.props, prev);
    
    switch (activeView) {
      case MAIN_VIEW:
        this.shouldUpdateHeatMap(canonicalTrips, prev.canonicalTrips); 
        this.toggleTripsAndLocations();
        break;
        default:
          if (this.heatmapLayer) {
            this.map.removeLayer(this.heatmapLayer);        
          }
        }
  }

  shouldUpdateSegmentsArePoints (current, previous) {
    const { segmentsArePoints } = current;
    if (segmentsArePoints !== previous.segmentsArePoints) {
      Object.keys(this.segments).forEach((segment) => {
        segment = this.segments[segment];
        if (segment) {
          segment.polyline.setStyle({ opacity: segmentsArePoints ? 0 : 1 });
        }
      })
    }
  }

  shouldUpdateHeatMap (current, previous) {
    const currentZoom = this.map.getZoom();
    const { detailLevel } = this.props;

    if (current !== previous && currentZoom < detailLevel) {
      const _points = [];
      
      // Add all points from canonical trips to array. geoJSON coordinates are defined by (longitude, latitude)
      Object.values(current.toJS()).forEach((trip) => trip.geoJSON.coordinates.forEach((point) => _points.push([point[1], point[0], 1.0])));
      
      this.heatmapLayer = L.heatLayer(_points, {
        radius: 18
      }).addTo(this.map);
    }
  }

  shouldUpdatePrompt (current, previous) {
    if (current !== previous) {
      if (current) {
        this.map.on('click', (e) => {
          const { latlng } = e;
          const { lat, lng } = latlng;
          const res = { lat: lat, lon: lng };
          current(res);
        });
      } else {
        this.map.off('click');
      }
    }
  }

  shouldUpdateZoom (current, previous) {
    if (current !== previous || this.map.getZoom() !== current) {
      this.map.setZoom(current);
    }
  }

  shouldUpdateCenter (current, previous) {
    if (this.locationHighlight) {
      this.locationHighlight.remove(this.map);
      this.locationHighlight = null;
    }
    if (current !== previous) {
      this.map.setView({ lat: current.lat, lng: current.lon });
      const icon = createPointIcon(null, null, 'highlight-point', [19, 19]);
      this.locationHighlight = createMarker({ lat: current.lat, lng: current.lon}, icon);
      this.locationHighlight.addTo(this.map);
    }

  }

  shouldUpdateSegments (segments, previous) {
    if (segments !== previous) {
      segments.forEach((segment) => {
        const id = segment.get('id');
        const lseg = this.segments[id];

        if (lseg) {
          this.shouldUpdateSegment(segment, previous.get(id), lseg);
        }
        switch(this.props.activeView) {
          default:
            if (!lseg) {
              this.shouldAddSegment(segment, previous.get(id));
            }
        }
      });
      
      this.shouldRemoveSegments(segments, previous);
    }
  }

  shouldUpdateTrips (trips, previous) {
    if (trips !== previous) {
      trips.forEach((trip) => {
        const id = trip.id;
        const lseg = this.trips[id];

        if (!lseg) {
          this.shouldUpdateTrip(trip, previous.get(id));
        }
      });

      this.shouldRemoveTrips(trips, previous);
    }
  }
  
  shouldUpdateTrip (trip, previous) {
    if (trip !== previous) {
      const trips = trip.trips.map((t) => t.geoJSON);
      
      this.addTrip(trip.id, trip.color, trips, false);
    }    
  }
  
  shouldUpdateCanonicalTrips (trips, previous) {
    if (trips !== previous) {
      trips.forEach((trip) => {
        const id = trip.id;
        const lseg = this.canonical[id];
        if (!lseg) {
          this.shouldUpdateCanonicalTrip(trip, previous.get(id));
        }
      });
      
      this.shouldRemoveCanonicalTrips(trips, previous);
    }
  }
  
  shouldUpdateCanonicalTrip (trip, previous) {
    if (trip !== previous) {
      this.addTrip(trip.id, trip.color, trip.geoJSON, true);
    }    
  }
  
  shouldUpdateSegment (current, previous, lseg) {
    if (current !== previous) {
      const points = current.get('points');
      const color = current.get('color');
      const display = current.get('display');
      const id = current.get('id');
      const filter = current.get('timeFilter');

      this.shouldUpdateSegmentPoints(lseg, points, filter, previous, color, current);
      this.shouldUpdateColor(lseg, color, previous.get('color'));
      this.shouldUpdateDisplay(lseg, display, previous.get('display'));
      this.shouldUpdateMode(lseg, current, previous);
    }
  }
  
  shouldAddSegment(current, previous) {
    if (current !== previous) {
      const points = current.get('points');
      const color = current.get('color');
      const display = current.get('display');
      const id = current.get('id');
      const filter = current.get('timeFilter');
  
      this.addSegment(id, points, color, display, filter, false);
    }
  }

  shouldUpdateLocation (current, previous) {
    if (current !== previous) {
      const id = current.get('label');
      const lseg = this.locations[id];

      if (!lseg) {
        this.addLocationPoint(current);
      }
    }
  }

  shouldUpdateLocations (locations, previous) {
    if (locations !== previous) {
      locations.forEach((loc) => {
        this.shouldUpdateLocation(loc, previous.get(loc.get('label')));
      });

      this.shouldRemoveLocations(locations, previous);
    }
  }

  shouldUpdateHighlightedPoints (highlighted, previous) {
    if (highlighted === previous) {
      return;
    }

    this.pointHighlights = this.pointHighlights.filter((point) => {
      this.map.removeLayer(point);
    });

    const icon = createPointIcon(null, null, 'highlight-point', [19, 19]);
    highlighted.reduce((arr, point) => {
      const marker = createMarker(point.toJS(), icon);
      this.map.addLayer(marker);
      arr.push(marker);
      return arr;
    }, this.pointHighlights);
  }

  shouldUpdateHighlighted (highlighted, previous, allSegments) {
    if (highlighted === previous) {
      return;
    }

    const setOpacity = (ids, opacity) => {
      ids.forEach((id) => {
        const lseg = this.segments[id];
        lseg.layergroup.setStyle({
          opacity
        });

        Object.keys(lseg.specialMarkers).forEach((key) => {
          lseg.specialMarkers[key].setOpacity(opacity);
        })
      })
    }

    const hidden = allSegments.filterNot((s) => highlighted.has(s.get('id'))).map((s) => s.get('id'));

    if (highlighted.count() > 0) {
      setOpacity(highlighted, 1, true);
      setOpacity(hidden, 0.1, false);
    } else {
      setOpacity(hidden, 1);
    }
  }

  shouldHighlightTripVisibility (day, trip) {
    const { selectedDay } = this.props;
    let opacity ;

    if (!selectedDay) {
      opacity = '1';
    } else if (day !== selectedDay.format("YYYY-MM-DD")) {
      opacity = '0.1';
    } else {
      opacity = '1';
      trip.layergroup.bringToFront();
    }

    trip.layergroup.setStyle({
      opacity
    });
  }

  toggleTripsAndLocations () {
    const { decorationLevel, detailLevel } = this.props;
    const currentZoom = this.map.getZoom();

    for (const [key, value] of Object.entries(this.canonical)) {
      if (currentZoom >= decorationLevel && currentZoom < detailLevel) {
        value.layergroup.addTo(this.map);       
      } else {
        this.map.removeLayer(value.layergroup);
      }
    }

    for (const [key, value] of Object.entries(this.trips)) {
      this.shouldHighlightTripVisibility(key, value);
      
      if (currentZoom >= detailLevel) {
        value.layergroup.addTo(this.map);       
      } else {
        this.map.removeLayer(value.layergroup);
      }
    }

    for (const [key, value] of Object.entries(this.locations)) {
      if (currentZoom >= decorationLevel) {
        value.layergroup.addTo(this.map);
      } else {
        this.map.removeLayer(value.layergroup);
      }
    }
  }

  onMoveEnd (e) {
    const { detailLevel, activeView, dispatch } = this.props;
    const currentZoom = this.map.getZoom();
    const bounds = this.map.getBounds();
    const southWestBounds = bounds.getSouthWest();
    const northEastBounds = bounds.getNorthEast();
    
    switch (activeView) {
      case MAIN_VIEW:
        if (currentZoom >= detailLevel) {
          dispatch(canLoadMoreTripsInBounds(southWestBounds.lat, southWestBounds.lng, northEastBounds.lat, northEastBounds.lng, false));
        } 
         
        this.toggleTripsAndLocations();
        break;
    }
  }

  onZoomMainView () {
    const { detailLevel, decorationLevel, dispatch, selectedDay, segments } = this.props;
    const currentZoom = this.map.getZoom();
    const bounds = this.map.getBounds();
    const southWestBounds = bounds.getSouthWest();
    const northEastBounds = bounds.getNorthEast();

    if (currentZoom >= detailLevel && this.state.loadTrips) {
      dispatch(loadTripsInBounds(southWestBounds.lat, southWestBounds.lng, northEastBounds.lat, northEastBounds.lng, false));
      this.toggleTripsAndLocations();
      this.setState({loadTrips: false});
    } else if (currentZoom < decorationLevel && !this.state.loadTrips) {
      if (segments.size > 0) dispatch(clearTrips());
      this.setState({loadTrips: true});
    }

    if (this.heatmapLayer) {
      if (currentZoom >= detailLevel) {
        this.map.removeLayer(this.heatmapLayer);
      } else {
        this.heatmapLayer.addTo(this.map);
      }
    }
    
    this.toggleTripsAndLocations();
  }

  onZoomTrackProcessing () {
    const { detailLevel, decorationLevel, segmentsArePoints } = this.props;
    const currentZoom = this.map.getZoom();

    if (currentZoom >= detailLevel || currentZoom >= decorationLevel || segmentsArePoints) {
      // add layers
      Object.keys(this.segments).forEach((s) => {
        if (this.segments[s]) {
          const { details, layergroup } = this.segments[s];
          if ((layergroup.hasLayer(details) === false && currentZoom >= detailLevel) || segmentsArePoints) {
            layergroup.addLayer(details);
          }
        }
      });

      Object.keys(this.locations).forEach((s) => {
        if (this.locations[s]) {
          const { details, layergroup } = this.locations[s];
          if ((layergroup.hasLayer(details) === false && currentZoom >= detailLevel) || segmentsArePoints) {
            layergroup.addLayer(details);
          }
        }
      });
    } else {
      Object.keys(this.locations).forEach((s) => {
        if (this.locations[s]) {
          const { details, layergroup } = this.locations[s];
          if (layergroup.hasLayer(details) === true && !segmentsArePoints) {
            layergroup.removeLayer(details);
          }
        }
      });
    }
  }

  onZoomEnd (e) {
    const { dispatch } = this.props;
    const currentZoom = this.map.getZoom();

    dispatch(setZoomLevel(currentZoom));

    switch(this.props.activeView) {
      case MAIN_VIEW:
        this.onZoomMainView()
        break;
      case TRACK_PROCESSING:
        this.onZoomTrackProcessing();
        break;
    }

  }

  shouldUpdateMode (lseg, current, previous) {
    if (lseg.updated) {
      lseg.updated = false;
      return;
    }

    if (lseg.tearDown) {
      lseg.tearDown(current, previous);
    }

    const { dispatch } = this.props;
    if (current.get('splitting') === true && current.get('splitting') !== previous.get('splitting')) {
      splitMode(lseg, current, previous, (id, index) => dispatch(splitSegment(id, index)));
    }
    if (current.get('pointDetails') === true && current.get('pointDetails') !== previous.get('pointDetails')) {
      detailMode(lseg, current, previous);
    }
    if (current.get('editing') === true && current.get('editing') !== previous.get('editing') || (current.get('editing') && current.get('points') !== previous.get('points'))) {
      editMode(lseg, current, previous, {
        onRemove: (id, index, lat, lng) => dispatch(removeSegmentPoint(id, index, lat, lng)),
        onAdd: (id, index, lat, lng) => dispatch(addSegmentPoint(id, index, lat, lng)),
        onMove: (id, index, lat, lng) => dispatch(changeSegmentPoint(id, index, lat, lng)),
        onExtend: (id, index, lat, lng) => dispatch(extendSegment(id, index, lat, lng))
      }, dispatch);
    }
    if (current.get('joining') === true && (current.get('joining') !== previous.get('joining') || current.get('joinPossible') !== previous.get('joinPossible'))) {
      joinMode(lseg, current, previous, (id, i, pp) => dispatch(joinSegment(id, i, pp)));
    }
    if (current.get('pointAction') && current.get('pointAction') !== previous.get('pointAction')) {
      pointActionMode(lseg, current, previous)
    }
  }

  shouldUpdateBounds (bounds, prev) {
    let tBounds;
    if (bounds) {
      tBounds = latLngBounds([[bounds.minLat, bounds.minLon], [bounds.maxLat, bounds.maxLon]]);
    }
    if (bounds !== prev) {
      this.fitBounds(tBounds);
    }
  }

  shouldUpdateSegmentPoints (segment, points, filter, prev, color, current) {
    const buildTimeFilter = (filter, points) => {
      const tfLower = (filter.get(0) || points.get(0).get('time')).valueOf();
      const tfUpper = (filter.get(-1) || points.get(-1).get('time')).valueOf();
      return (point) => {
        const t = point.get('time').valueOf();
        return tfLower <= t && t <= tfUpper;
      }
    }
    
    if (!segment.updated && (points !== prev.get('points') || filter.get(0) !== prev.get('timeFilter').get(0) || filter.get(-1) !== prev.get('timeFilter').get(-1) || current.get('showTimeFilter') !== prev.get('showTimeFilter'))) {
      const c = current.get('showTimeFilter') ? points.filter(buildTimeFilter(filter, points)) : points;
      const p = prev.get('showTimeFilter') ? prev.get('points').filter(buildTimeFilter(prev.get('timeFilter'), prev.get('points'))) : prev.get('points');
      updatePoints(segment, c, p, color);
    }
  }

  shouldUpdateColor (segment, color, prev) {
    if (color !== prev) {
      segment.layergroup.setStyle({
        color
      });
    }
  }

  shouldUpdateDisplay (segment, display, prev) {
    if (display !== prev) {
      segment.layergroup.setStyle({
        opacity: display ? 1 : 0.2
      });
      
      Object.keys(segment.specialMarkers).forEach((key) => {
        segment.specialMarkers[key].setOpacity(display ? 1 : 0.2);
      });
    }
  }

  addTrip (id, color, trips, canonical) {
    const layergroup = L.geoJSON(trips, {style: {color: color}}).addTo(this.map);
    const date = moment(id);
    
    if (canonical) {
      this.canonical[id] = {layergroup};
      layergroup.bindTooltip(
        "<div style='width: 50px'>" +
        "   <span style='border: 3px solid white; background-color: #E93E3A; width: 100%; padding: 5px 10px'> Zoom In For More Detail </span>" +
        "</div>"
        , {sticky: true, className: 'custom-leaflet-tooltip', direction: 'right'});
    } else {
        this.trips[id] = {layergroup};
        layergroup.on('click', () => this.onTripClick(date));

        layergroup.bindTooltip(
          "<div style='width: 50px'>" +
          "   <span style='border: 3px solid white; background-color: "+ color +"; width: 100%; padding: 5px 10px'> "+ date.format("DD/MM/YYYY") +" </span>" +
          "</div>"
        , {sticky: true, className: 'custom-leaflet-tooltip', direction: 'right'});
    } 
  }

  addSegment (id, points, color, display, filter, canonical) {
    const { detailLevel, activeView } = this.props;
    const currentZoom = this.map.getZoom();

    const obj = addSegment(id, points, color, display, filter);
    
    if (canonical) {
      this.canonical[id] = obj;
    } else {
      this.segments[id] = obj;
    } 
    
    if (activeView !== MAIN_VIEW) {
      obj.layergroup.addTo(this.map);
    }

    if (currentZoom >= detailLevel) {
      obj.details.addTo(obj.layergroup);
    }
  }

  onTripClick(date) {
    const { dispatch, activeView } = this.props;

    switch (activeView) {
      case MAIN_VIEW:
        dispatch(setSelectedDay(date));
        break;
    }
  }

  addLocationPoint(point) {
    const currentZoom = this.map.getZoom();
    const { detailLevel, activeView } = this.props;
    let obj = addLocation(point, 'var(--secondary)');
    
    switch(activeView) {
      case MAIN_VIEW:
        if (currentZoom >= detailLevel) {
          obj.layergroup.addTo(this.map);
          obj.details.addTo(obj.layergroup);
        }
        break;
      case VISUAL_QUERIES:
        obj = addLocation(point, '#c3c3c3');
        break;
    }
    
    this.locations[point.label] = obj;
    obj.layergroup.addTo(this.map);
  }

  shouldRemoveTrips (trips, prev) {
    if (trips !== prev && Object.keys(this.trips).length > 0) {
      // delete trip if needed
      Set(prev.keySeq()).subtract(trips.keySeq()).forEach((s) => {
        if (this.trips[s]) {
          this.map.removeLayer(this.trips[s].layergroup);
          delete this.trips[s];
        }
      })
    }
  }

  shouldRemoveSegments (segments, prev) {
    if (segments !== prev && Object.keys(this.segments).length > 0) {
      // delete segment if needed
      Set(prev.keySeq()).subtract(segments.keySeq()).forEach((s) => {
        if (this.segments[s]) {
          this.map.removeLayer(this.segments[s].layergroup);
          delete this.segments[s];
        }
      })
    }
  }

  shouldRemoveCanonicalTrips (trips, prev) {
    if (trips !== prev && Object.keys(this.canonical).length > 0) {
      // delete segment if needed
      Set(prev.keySeq()).subtract(trips.keySeq()).forEach((s) => {
        this.map.removeLayer(this.canonical[s].layergroup);
        delete this.canonical[s];
      })
    }
  }

  shouldRemoveLocations (points, prev) {
    if (points !== prev && Object.keys(this.locations).length > 0) {
      // delete point if needed
      Set(prev.keySeq()).subtract(points.keySeq()).forEach((s) => {
        this.map.removeLayer(this.locations[s].layergroup);
        delete this.locations[s];
      })
    }
  }

  render () {
    return (
      <div id='map' ref={this.mapRef} style={{zIndex: 1, position: 'absolute', height: '100%'}}></div>
    );
  }
}

LeafletMap.defaultProps = DEFAULT_PROPS;
