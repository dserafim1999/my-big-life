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
  joinSegment,
  toggleSegmentInfo
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
import detailMode from './point/detailMode';
import addSegment from './components/addSegment';
import { createMarker, createPointIcon } from './utils';
import addLocation from './components/addLocation';
import { clearTrips, loadMoreTripsInBounds, loadTripsInBounds } from '../../actions/tracks';
import { MAIN_VIEW, TRACK_PROCESSING } from '../../constants';
import moment from 'moment';

const DEFAULT_PROPS = {
  detailLevel: 15,
  decorationLevel: 13,
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
    this.canonical = {};
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

    const { dispatch } = this.props;
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
      canonicalTrips,
      locations,
      dispatch,
      activeView,
      canUndo,
      canRedo,
      pointPrompt,
      detailLevel
    } = this.props;

    if (canUndo !== prev.canUndo) {
      this.map.buttons.setEnabled(0, canUndo);
    }

    if (canRedo !== prev.canRedo) {
      this.map.buttons.setEnabled(1, canRedo);
    }

    switch (activeView) {
      case MAIN_VIEW:
        this.shouldUpdateHeatMap(canonicalTrips, prev.canonicalTrips);        
        this.shouldUpdateCanonicalTrips(canonicalTrips, prev.canonicalTrips, dispatch);
        this.shouldUpdateLocations(locations, prev.locations);

        break;
      default:
        if (this.heatmapLayer) {
          this.map.removeLayer(this.heatmapLayer);        
        }
    }
      
    this.shouldUpdateSegments(segments, prev.segments, dispatch);
    this.shouldUpdateZoom(zoom, prev.zoom);
    this.shouldUpdateCenter(center, prev.center);
    this.shouldUpdateBounds(bounds, prev.bounds);
    this.shouldUpdateHighlighted(highlighted, prev.highlighted, segments);
    this.shouldUpdateHighlightedPoints(highlightedPoints, prev.highlightedPoints, segments);
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
      const _points = [];
      Object.values(current.toJS()).forEach((segment) => segment.points.forEach((point) => _points.push([point.lat, point.lon, 1.0])));

      this.heatmapLayer = L.heatLayer(_points, {
        radius: 15,
        gradient: {
          '0': 'rgb(233,62,58)',
          '0.4': 'rgb(237,104,60)',
          '0.6': 'rgb(243,144,63)',
          '0.8': 'rgb(253,199,12)',
          '1': 'rgb(255,243,59)'
        }
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
        const id = segment.get('id');
        const lseg = this.segments[id];

        if (lseg) {
          this.shouldUpdateSegment(segment, previous.get(id), lseg, dispatch);
        }
        switch(this.props.activeView) {
          default:
            if (!lseg) {
              this.shouldAddSegment(segment, previous.get(id), dispatch);
            }
        }
      });
      
      this.shouldRemoveSegments(segments, previous);
    }
  }

  shouldUpdateSegment (current, previous, lseg, dispatch) {
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

  shouldUpdateCanonicalTrips (segments, previous, dispatch) {
    if (segments !== previous) {
      segments.forEach((segment) => {
        const id = segment.get('id');
        const lseg = this.segments[id];

        if (!lseg) {
          if (segment !== previous.get(id)) {
            const points = segment.get('points');
            const color = segment.get('color');
            const display = segment.get('display');
            const id = segment.get('id');
            const filter = segment.get('timeFilter');
        
            this.addSegment(id, points, color, display, filter, true);
          }
        }
      });
      
      this.shouldRemoveSegments(segments, previous);
    }
  }

  shouldAddSegment(current, previous, dispatch) {
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

  toggleSegmentsAndLocations () {
    const { decorationLevel, detailLevel } = this.props;
    const currentZoom = this.map.getZoom();

    for (const [key, value] of Object.entries(this.canonical)) {
      if (currentZoom >= decorationLevel && currentZoom < detailLevel) {
        value.layergroup.addTo(this.map);       
      } else {
        this.map.removeLayer(value.layergroup);
      }
    }

    for (const [key, value] of Object.entries(this.segments)) {
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
          dispatch(loadMoreTripsInBounds(southWestBounds.lat, southWestBounds.lng, northEastBounds.lat, northEastBounds.lng, false));
        } 
         
        this.toggleSegmentsAndLocations();
        break;
    }
  }

  onZoomMainView () {
    const { detailLevel, decorationLevel, dispatch, segments } = this.props;
    const currentZoom = this.map.getZoom();
    const bounds = this.map.getBounds();
    const southWestBounds = bounds.getSouthWest();
    const northEastBounds = bounds.getNorthEast();

    if (currentZoom >= detailLevel && this.loadTrips) {
      dispatch(loadTripsInBounds(southWestBounds.lat, southWestBounds.lng, northEastBounds.lat, northEastBounds.lng, false));
      this.toggleSegmentsAndLocations();
      this.loadTrips = false;
    } else if (currentZoom < decorationLevel && !this.loadTrips) {
      if (segments.size > 0) dispatch(clearTrips());
      this.loadTrips = true;
    }

    if (this.heatmapLayer) {
      if (currentZoom >= detailLevel) {
        this.map.removeLayer(this.heatmapLayer);
      } else {
        this.heatmapLayer.addTo(this.map);
      }
    }
    
    this.toggleSegmentsAndLocations();
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

  addSegment (id, points, color, display, filter, canonical) {
    const { detailLevel, activeView } = this.props;
    const currentZoom = this.map.getZoom();

    const obj = addSegment(id, points, color, display, filter);
    const date = moment(points.get(0).get('time'));
    
    if (canonical) {
      this.canonical[id] = obj;

      obj.layergroup.bindTooltip(
        "<div style='width: 50px'>" +
        "   <span style='border: 3px solid white; background-color: #E93E3A; width: 100%; padding: 5px 10px'> Zoom In For More Detail </span>" +
        "</div>"
      , {sticky: true, className: 'custom-leaflet-tooltip', direction: 'right'});
    } else {
      this.segments[id] = obj;
      obj.layergroup.on('click', () => this.onSegmentClick(id, date.format("YYYY_MM_DD"), activeView));

      obj.layergroup.bindTooltip(
        "<div style='width: 50px'>" +
        "   <span style='border: 3px solid white; background-color: "+ color +"; width: 100%; padding: 5px 10px'> "+ date.format("DD/MM/YYYY") +" </span>" +
        "</div>"
      , {sticky: true, className: 'custom-leaflet-tooltip', direction: 'right'});
    } 
    
    if (activeView !== MAIN_VIEW) {
      obj.layergroup.addTo(this.map);
    }

    if (currentZoom >= detailLevel) {
      obj.details.addTo(obj.layergroup);
    }
  }

  onSegmentClick(segmentId, date, activeView) {
    const { dispatch } = this.props;

    switch (activeView) {
      case MAIN_VIEW:
        dispatch(toggleSegmentInfo(true, segmentId, date));
        break;
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
        if (this.segments[s]) {
          this.map.removeLayer(this.segments[s].layergroup);
          delete this.segments[s];
        }
      })
    }
  }

  shouldRemoveCanonicalTrips (segments, prev) {
    if (segments !== prev) {
      // delete segment if needed
      Set(prev.keySeq()).subtract(segments.keySeq()).forEach((s) => {
        this.map.removeLayer(this.canonical[s].layergroup);
        delete this.canonical[s];
      })
    }
  }

  shouldRemoveLocations (points, prev) {
    if (points !== prev) {
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
