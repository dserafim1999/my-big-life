import { map, latLngBounds } from 'leaflet';
import "leaflet.heat";
import React, { Component } from 'react';
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

import {
  undo, 
  redo
} from '../../actions/process';

import setupTileLayers from './components/setupTileLayers';
import setupControls from './components/setupControls';

import editMode from './editing/editMode';
import joinMode from './editing/joinMode';
import splitMode from './editing/splitMode';
import updatePoints from './point/updatePoints';
import pointActionMode from './editing/pointActionMode';
import buildTransportationModeRepresentation from './point/buildTransportationModeRepresentation';
import detailMode from './point/detailMode';
import addSegment from './components/addSegment';
import { createMarker, createPointIcon } from './utils';
import addLocation from './components/addLocation';
import { clearTrips, loadTripsInBounds } from '../../actions/tracks';
import { MAIN_VIEW, TRACK_PROCESSING } from '../../constants';

const DEFAULT_PROPS = {
  detailLevel: 14,
  decorationLevel: 12,
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
    this.segments = {};
    this.locations = {};
    this.pointHighlights = [];
    this.heatmapLayer = null;
    this.loadTrips = false;
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
    this.map.fitBounds(where, {
      maxZoom: this.map.getBoundsZoom(where, true),
      ...this.getBoundsObj()
    });
  }

  fitWorld () {
    this.map.fitWorld(this.getBoundsObj());
  }

  componentDidMount () {
    const { mapCreation } = this.props;
    const m = findDOMNode(this.mapRef.current);
    this.map = map(m, mapCreation);

    setupTileLayers(this.map);

    const { dispatch } = this.props
    setupControls(this.map, {
      canUndo: this.props.canUndo,
      canRedo: this.props.canRedo,
      undo: () => dispatch(undo()),
      redo: () => dispatch(redo()),
    })


    this.fitWorld();
    this.map.on('zoomend', this.onZoomEnd.bind(this));
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
      canonicalTrips,
      locations,
      dispatch,
      activeView,
      canUndo,
      canRedo,
      pointPrompt
    } = this.props;

    if (canUndo !== prev.canUndo) {
      this.map.buttons.setEnabled(0, canUndo);
    }

    if (canRedo !== prev.canRedo) {
      this.map.buttons.setEnabled(1, canRedo);
    }

    if (activeView === MAIN_VIEW) {
      this.shouldUpdateHeatMap(canonicalTrips, prev.canonicalTrips);
    } else {
      if (this.heatmapLayer) {
        this.map.removeLayer(this.heatmapLayer);        
      }
    }
    
    this.shouldUpdateZoom(zoom, prev.zoom);
    this.shouldUpdateCenter(center, prev.center);
    this.shouldUpdateBounds(bounds, prev.bounds);
    this.shouldUpdateHighlighted(highlighted, prev.highlighted, segments);
    this.shouldUpdateHighlightedPoints(highlightedPoints, prev.highlightedPoints, segments);
    this.shouldUpdateSegments(segments, prev.segments, dispatch);
    this.shouldUpdateLocations(locations, prev.locations);
    this.shouldUpdatePrompt(pointPrompt, prev.pointPrompt);
    this.shouldUpdateSegmentsArePoints(this.props, prev);
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
    if (current !== previous) {
      this.heatmapLayer = L.heatLayer(current.toJS(), {
        radius: 15, 
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
    if (current !== previous) {
      this.map.setView({ lat: current.lat, lng: current.lon });
    }
  }

  shouldUpdateSegments (segments, previous, dispatch) {
    if (segments !== previous) {
      segments.forEach((segment) => {
        this.shouldUpdateSegment(segment, previous.get(segment.get('id')), dispatch)
      });
      
      this.shouldRemoveSegments(segments, previous);
    }
  }

  shouldUpdateSegment (current, previous, dispatch) {
    if (current !== previous) {
      const points = current.get('points');
      const color = current.get('color');
      const display = current.get('display');
      const id = current.get('id');
      const filter = current.get('timeFilter');
      const lseg = this.segments[id];

      if (lseg && this.props.activeView === TRACK_PROCESSING) {
        this.shouldUpdateSegmentPoints(lseg, points, filter, previous, color, current);
        this.shouldUpdateColor(lseg, color, previous.get('color'));
        this.shouldUpdateDisplay(lseg, display, previous.get('display'));
        this.shouldUpdateMode(lseg, current, previous);
        this.shouldUpdateTransportationModes(lseg, current, previous);
      } else {
        this.addSegment(id, points, color, display, filter, current, dispatch, previous, current);
      }
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

  shouldUpdateTransportationModes (lseg, current, previous) {
    if (current.get('transportationModes') !== previous.get('transportationModes')) {
      lseg.layergroup.removeLayer(lseg.transportation);
      lseg.transportation = buildTransportationModeRepresentation(lseg, current);
      this.onZoomEnd();
    }
  }

  shouldUpdateHighlightedPoints (highlighted, previous, allSegments) {
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
        lseg.transportation.getLayers().forEach((m) => m.setOpacity(opacity));

        Object.keys(lseg.specialMarkers).forEach((key) => {
          lseg.specialMarkers[key].setOpacity(opacity);
        })
      })
    }

    const hidden = allSegments.filterNot((s) => highlighted.has(s.get('id'))).map((s) => s.get('id'));

    if (highlighted.count() > 0) {
      setOpacity(highlighted, 1);
      setOpacity(hidden, 0.2);
    } else {
      setOpacity(hidden, 1);
    }
  }

  onZoomEnd (e) {
    const { detailLevel, decorationLevel, segmentsArePoints, activeView, dispatch } = this.props;
    const currentZoom = this.map.getZoom();
    const bounds = this.map.getBounds();
    const southWestBounds = bounds.getSouthWest();
    const northEastBounds = bounds.getNorthEast();

    if (activeView === MAIN_VIEW) {
      if (currentZoom >= decorationLevel && this.loadTrips) {
        dispatch(loadTripsInBounds(southWestBounds.lat, southWestBounds.lng, northEastBounds.lat, northEastBounds.lng));
        this.loadTrips = false;
      } else if (currentZoom < decorationLevel) {
        dispatch(clearTrips());
        this.loadTrips = true;
      }

      if (this.heatmapLayer) {
        if (currentZoom >= detailLevel) {
          this.map.removeLayer(this.heatmapLayer);
        } else {
          this.heatmapLayer.addTo(this.map);
        }
      }
      
      for (const [key, value] of Object.entries(this.segments)) {
        if (value === null) continue;
        if (currentZoom >= detailLevel) {
          value.layergroup.addTo(this.map);       
        } else {
          this.map.removeLayer(value.layergroup);
        }
      }
  
      for (const [key, value] of Object.entries(this.locations)) {
        if (value === null) continue;
        if (currentZoom >= decorationLevel) {
          value.layergroup.addTo(this.map);
        } else {
          this.map.removeLayer(value.layergroup);
        }
      }
    } else {

      if (currentZoom >= detailLevel || currentZoom >= decorationLevel || segmentsArePoints) {
        // add layers
        Object.keys(this.segments).forEach((s) => {
          if (this.segments[s]) {
            const { details, transportation, layergroup } = this.segments[s];
            if ((layergroup.hasLayer(details) === false && currentZoom >= detailLevel) || segmentsArePoints) {
              layergroup.addLayer(details);
            }
  
            if (layergroup.hasLayer(transportation) === false && decorationLevel) {
              layergroup.addLayer(transportation);
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
        // remove layers
        Object.keys(this.segments).forEach((s) => {
          if (this.segments[s]) {
            const { details, transportation, layergroup } = this.segments[s];
            if (layergroup.hasLayer(details) === true && !segmentsArePoints) {
              layergroup.removeLayer(details);
            }
  
            if (layergroup.hasLayer(transportation) === true) {
              layergroup.removeLayer(transportation);
            }
          }
        });
  
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

  addSegment (id, points, color, display, filter, segment, dispatch, previous, current) {
    const obj = addSegment(id, points, color, display, filter, segment, dispatch, null, current, previous);
    this.segments[id] = obj;
    if (this.props.activeView !== MAIN_VIEW) obj.layergroup.addTo(this.map);

    const currentZoom = this.map.getZoom();
    const { detailLevel, decorationLevel } = this.props;
    if (currentZoom >= detailLevel) {
      obj.details.addTo(obj.layergroup);
    }
    if (currentZoom >= decorationLevel) {
      obj.transportation.addTo(obj.layergroup);
    }
  }

  addLocationPoint(point) {
    const obj = addLocation(point, '#000000');
    this.locations[point.label] = obj;

    const currentZoom = this.map.getZoom();
    const { detailLevel } = this.props;
    if (currentZoom >= detailLevel) {
      obj.layergroup.addTo(this.map);
      obj.details.addTo(obj.layergroup);
    }
  }

  shouldRemoveSegments (segments, prev) {
    if (segments !== prev) {
      // delete segment if needed
      Set(prev.keySeq()).subtract(segments.keySeq()).forEach((s) => {
        this.map.removeLayer(this.segments[s].layergroup);
        this.segments[s] = null;
      })
    }
  }

  shouldRemoveLocations (points, prev) {
    if (points !== prev) {
      // delete point if needed
      Set(prev.keySeq()).subtract(points.keySeq()).forEach((s) => {
        this.map.removeLayer(this.locations[s].layergroup);
        this.locations[s] = null;
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
