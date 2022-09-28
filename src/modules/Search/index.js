import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import Card from '../../components/Card';
import AsyncButton from '../../components/Buttons/AsyncButton';
import { addQueryStay, executeQuery, resetQuery } from '../../actions/queries';
import SearchStay from './SearchStay';
import SimpleButton from '../../components/Buttons/SimpleButton';

import SearchIcon from '@mui/icons-material/Search';
import { BoundsRecord } from '../../records';
import { updateBounds } from '../../actions/map';
import { DEFAULT_STAY } from '../../constants';
import { TextField } from '../../components/Form';
import { clearLocations, clearTrips } from '../../actions/trips';

const Search = ({ dispatch, isVisible, isQueryLoading }) => {
  if (!isVisible) return null;

  const [query, setQuery] = useState(DEFAULT_STAY);

  useEffect( () => {
    onClearQuery();
    dispatch(updateBounds(new BoundsRecord().setWithCoords(90, -200, -90, 200)));
  }, []);

  const addSuffix = (value, suffix) => {
    return value !== "" ? value + suffix : value;
  }

  const onClearQuery = () => {
    setQuery(DEFAULT_STAY);
    dispatch(clearTrips());
    dispatch(clearLocations());
  }

  const onSubmit = () => {
    dispatch(executeQuery(
        {
            "data": [
                {
                    "date": '--/--/----'
                },
                query
            ],
            "loadAll": true
        }
      )
    );
  }

  return (
    <Card width={400} title='Search' verticalOffset={1} horizontalOffset={1}>
      <TextField title='Location' onChange={(value) => setQuery({...query, location: value})} help='Location name (or coordinates)'/>
      <TextField title='Spatial Range' hasOperators={true} onChange={(value) => setQuery({...query, spatialRange: addSuffix(value, 'm')})} type='number' min={0} suffix={"m"} help='Set range for searched location'/>
      <footer style={{ textAlign: 'right' }} className='control'>
        <SimpleButton 
          title='Clear Results'
          onClick={onClearQuery}
          className='is-light'
          style={{marginRight: '10px'}}
        > Clear Results </SimpleButton> 
        <AsyncButton 
          title='Search'
          className={'is-blue' + (isQueryLoading ? ' is-loading' : '')}
          onClick={(e, modifier) => {
            onSubmit();
          }} > 
          Search 
          <SearchIcon style={{marginLeft: '10px'}}/>
        </AsyncButton>
      </footer>
    </Card>
  );
}

const mapStateToProps = (state) => {
  return {
    isVisible: state.get('general').get('isUIVisible'),
    isQueryLoading: state.get('general').get('loading').get('query-button')
  };
}

export default connect(mapStateToProps)(Search);

