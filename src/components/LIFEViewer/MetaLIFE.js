import React, { useState } from "react"

import PropTypes from 'prop-types';

import { SEMANTIC_STYLES } from "../../constants";


/**
 * Represents all the LIFE meta commands for the current LIFE file in the LIFE Viewer
 * 
 * @param {object} categories Object containing locations and their categories
 * @param {object} coordinates Object containing locations and their coordinates
 * @param {object} locationSwaps Object containing old and new locations where an activity took place
 * @param {object} nameSwaps Object containing the old and new name for a location
 * @param {object} superPlaces Object containing locations and locations within them
 * @param {function} onLocationClick Behaviour when a location is selected
 * @constructor
 */

const MetaLIFE = ({ categories, coordinates, locationSwaps, nameSwaps, superPlaces, onLocationClick }) => {
  const [hover, setHover] = useState('');

  const onMouseEnter = (location) => {
    setHover(location);
  }

  const onMouseLeave = () => {
    setHover('');
  }

  const renderLocationPill = (location) => {
    return (
      <span 
        style={{ ...SEMANTIC_STYLES["_"], ...SEMANTIC_STYLES["Location"], border: hover === location ? '2px solid var(--main)' : '', margin: '3px', cursor: 'pointer'}} 
        onClick={() => onLocationClick(location)}
        onMouseEnter={() => onMouseEnter(location)}
        onMouseLeave={onMouseLeave}
      >{ location }</span>
    )
  }

  const renderTagPill = (tag) => {
    return <span style={{ ...SEMANTIC_STYLES["_"], ...SEMANTIC_STYLES["Tag"], margin: '3px'}}>{ tag }</span>;
  }
  
  const addCategories = () => {
    let categoriesDivs = [];
    for (let [category, locations] of Object.entries(categories)) {
      for (let location of locations) {
        categoriesDivs.push(
          <p style={{margin: '5px'}} key={location}>
            <b>@</b>
            { renderLocationPill(location) }
            <b>:</b>
            { renderTagPill(category)}
          </p>
        );
      }
    }
    return <div>{categoriesDivs}</div>;
  }

  const addCoordinates = () => {
    let coordinatesDivs = [];
    for (let [location, coords] of Object.entries(coordinates)) {
      coordinatesDivs.push(
        <p style={{margin: '5px'}} key={location}>
          <b>@</b>
          { renderLocationPill(location) }
          <b>@</b> { coords[0] }, { coords[1] }
        </p>
      );
    }
    return <div>{coordinatesDivs}</div>;
  }

  const addSuperPlaces = () => {
    let superPlacesDivs = [];
    for (let [superplace, subplace] of Object.entries(superPlaces)) {
      superPlacesDivs.push(
        <p style={{margin: '5px'}} key={subplace}>
          <b>@</b>
          { renderLocationPill(superplace) }
          <b>{'<'}</b>
          { renderLocationPill(subplace) }
        </p>
      );
    }
    return <div>{superPlacesDivs}</div>;
  }

  const addNameSwaps = () => {
    let nameSwapsDivs = [];
    for (let [oldName, newName] of Object.entries(nameSwaps)) {
      nameSwapsDivs.push(
        <p style={{margin: '5px'}} key={newName[0]}>
          <b>@</b>
          { renderLocationPill(oldName) }
          <b>{'>>'}</b>
          { renderLocationPill(newName[0]) }
        </p>
      );
    }
    return <div>{nameSwapsDivs}</div>;
  }

  const addLocationSwaps = () => {
    let locationSwapsDivs = [];
    for (let [oldName, newName] of Object.entries(locationSwaps)) {
      locationSwapsDivs.push(
        <p style={{margin: '5px'}} key={newName[0]}>
          <b>@</b>
          { renderLocationPill(oldName) }
          <b>{'>>>'}</b>
          { renderLocationPill(newName[0]) }
        </p>
      );
    }
    return <div>{locationSwapsDivs}</div>;
  }

  return (
    <div>
      {addCategories()}
      {addCoordinates()}
      {addSuperPlaces()}
      {addNameSwaps()}
      {addLocationSwaps()}
    </div>);
}

MetaLIFE.propTypes = {
  /** Object containing locations and their categories */
  categories: PropTypes.object,
  /** Object containing locations and their coordinates */
  coordinates: PropTypes.object,
  /** Object containing old and new locations where an activity took place */
  locationSwaps: PropTypes.object,
  /** Object containing the old and new name for a location */
  nameSwaps: PropTypes.object,
  /** Object containing locations and locations within them */
  superPlaces: PropTypes.object,
  /** Behaviour when a location is selected */
  onLocationClick: PropTypes.func,
}
  
export default MetaLIFE;
