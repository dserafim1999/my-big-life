import React, { useEffect, useState } from 'react';

import Card from '../../components/Card';
import AsyncButton from '../../components/Buttons/AsyncButton';
import DownloadingIcon from '@mui/icons-material/Downloading';
import SaveIcon from '@mui/icons-material/Save';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { saveConfig, getConfig, updateServer } from '../../actions/general';
import { TextField, ToggleField, OptionsField, SectionBlock } from '../../components/Form';
import { bulkProcess, getBulkProcessStatus } from '../../actions/process';

/**
 * Contains the logic and features for the Settings View
 * 
 * @param {function} dispatch Redux store action dispatcher
 * @param {string} address Server address 
 * @param {object} config Current configurations state 
 * @param {boolean} isLoading Whether configurations file is being loaded from server
 * @param {boolean} isVisible Determines if view UI components are visible
 * @param {boolean} isBulkProcessing Whether tracks are currently being uploaded in bulk
 * @param {number} bulkProgress Percentage of tracks that have already been processed (when bulk processing)
 */

const Settings = ({ dispatch, address, config, isLoading, isVisible, isBulkProcessing, bulkProgress }) => {
    if (!isVisible) return null;
    
    const bulkClassName = 'is-blue' + (isBulkProcessing ? ' is-loading' : '');

    useEffect( () => {
      dispatch(getConfig());
      dispatch(getBulkProcessStatus());
   }, []);

   const [state, setState] = useState({...config, address: address});

    const onBulkClick = (e, modifier) => {
      modifier('is-loading')
      dispatch(bulkProcess())
          .then(() => modifier());
    }

    const onSubmit = (e) => {
      if (state.address != address) {
        dispatch(updateServer(state.address));    
      } 
      
      dispatch(saveConfig(state));
    }

    let serverSpecific = <div></div>;
    if (config && !isLoading) {
      let timezones = [];
      for (let tz = -12; tz < 15; tz++) {
        timezones.push(
          {
            label: 'UTC' + (tz >= 0 ? '+' + tz : tz),
            key: tz
          }
        );
      }

      serverSpecific = (
        <div>
          <SectionBlock name='General'>
            <OptionsField title='Default timezone' options={timezones} defaultValue={config.default_timezone} onChange={(e) => setState({...state, default_timezone: e.target.value})} />
            <ToggleField title='Calculate canonical trips/locations on bulk track upload' checked={config.bulk_calculate_canonical} onChange={(e) => setState({...state, bulk_calculate_canonical: e.target.value})} />
          </SectionBlock>

          <SectionBlock name='Folders'>
            <TextField title='Input folder' onChange={(value) => setState({...state, input_path: value})} defaultValue={config.input_path} help='Path to the folder containing tracks to be processed' />
            <TextField title='Destination folder' onChange={(value) => setState({...state, output_path: value})} defaultValue={config.output_path} help='Path to folder where the processed tracks wil be saved' />
            <TextField title='Backup folder' onChange={(value) => setState({...state, backup_path: value})} defaultValue={config.backup_path} help='Path to the folder where the original tracks will be saved' />
            <TextField title='LIFE folder' onChange={(value) => setState({...state, life_path: value})} defaultValue={config.life_path} help='Path to the folder where each LIFE annotation will be saved. One file per day.' />
            <TextField title='LIFE file' onChange={(value) => setState({...state, life_all: value})} defaultValue={config.life_all} help='Path to the global file where LIFE annotations are stored. One file contains multiple days. Created if it does not exists.' />
          </SectionBlock>

          <SectionBlock name='Database'>
            <TextField title='Database host' onChange={(value) => setState({...state, db: {...state.db, host: value}})} defaultValue={config.db.host}/>
            <TextField title='Database name' onChange={(value) => setState({...state, db: {...state.db, name: value}})} defaultValue={config.db.name}/>
            <TextField title='Database username' onChange={(value) => setState({...state, db: {...state.db, user: value}})} defaultValue={config.db.user}/>
            <TextField title='Database password' onChange={(value) => setState({...state, db: {...state.db, pass: value}})} defaultValue={config.db.pass}/>
          </SectionBlock>

          <SectionBlock name='Trip'>
            <TextField title='Trip name format' onChange={(value) => setState({...state, trip_name_format: value})} defaultValue={config.trip_name_format} help={
              <span>Format of a trip. It is possible to use <a href='https://docs.python.org/2/library/datetime.html#strftime-strptime-behavior'>date formating</a>.</span>
            } />
            <ToggleField title='Create individual GPX file for segment in day' checked={config.multiple_gpxs_for_day} onChange={(e) => setState({...state, multiple_gpxs_for_day: e.target.value})} />
            <ToggleField title='Use LIFE trip annotations' checked={config.trip_annotations} onChange={(e) => setState({...state, trip_annotations: e.target.value})} help={
              <span><b>Example:</b> 0000-2359: location a -{'>'} location b</span>
            } />
          </SectionBlock>

          <SectionBlock name='Querying'>
            <TextField title='Load more results amount' onChange={(value) => setState({...state, load_more_amount: value})} defaultValue={config.load_more_amount} type='number' min='0'/>
          </SectionBlock>

          <SectionBlock name='Smoothing'>
            <ToggleField title='Use' onChange={(e) => setState({...state, smoothing: {...state.smoothing, use: e.target.value}})} checked={config.smoothing.use}/>
            { (state.smoothing ? state.smoothing.use : config.smoothing.use) && 
              (<>
                <OptionsField title='Algorithm' onChange={(e) => setState({...state, smoothing: {...state.smoothing, algorithm: e.target.value}})} options={[{ label: 'Kalman with backwards pass', key: 'inverse' }, { label: 'Kalman with start interpolation', key: '' }]} defaultValue={config.smoothing.algorithm} help={
                  <span>
                    <span>Algorithm to use to smooth tracks. There are two possibilities:</span>
                    <br/>
                    <b> - Kalman with backwards pass</b>: applies the kalman filter two times. One from the start to the end, then from the end to the start. Then, each one are cut in half and spliced together. This method provides better results, but requires more time.
                    <br/>
                    <b> - Kalman with start interpolation</b>: applies the kalman filter once, but first extrapolates the begining of the track.
                  </span>
                } />
                <TextField title='Noise' onChange={(value) => setState({...state, smoothing: {...state.smoothing, noise: value}})} defaultValue={config.smoothing.noise} type='number' min='1' step='1' help='Noise of the points in the track. Higher values yield smoother tracks. If the value is 1 then it is not smoothed.' />  
              </>)
            }
          </SectionBlock>

          <SectionBlock name='Spatiotemporal Segmentation'>
            <ToggleField title='Use' onChange={(e) => setState({...state, segmentation: {...state.segmentation, use: e.target.value}})} checked={config.segmentation.use} />
            { (state.segmentation ? state.segmentation.use : config.segmentation.use) &&
              (<>
                <TextField title='Epsilon' onChange={(value) => setState({...state, segmentation: {...state.segmentation, epsilon: value}})} defaultValue={config.segmentation.epsilon} type='number' min='0' step='0.01' help='Distance epsilon after which points can be clustered into the same stop. Points are clustered based on their spatiotemporal distance. The higher it is the less clusters will exist.'/>
                <TextField title='Min. time' onChange={(value) => setState({...state, segmentation: {...state.segmentation, min_time: value}})} defaultValue={config.segmentation.min_time} type='number' min='0' step='1' help='Minimum time at one place to consider it a stop' />
              </>)
            }
          </SectionBlock>

          <SectionBlock name='Simplification'>
            <ToggleField title='Use' onChange={(e) => setState({...state, simplification: {...state.simplification, use: e.target.value}})} checked={config.simplification.use} />
            { (state.simplification ? state.simplification.use : config.simplification.use) && 
              (<>
                <TextField title='Max. distance error' onChange={(value) => setState({...state, simplification: {...state.simplification, max_dist_error: value}})} defaultValue={config.simplification.max_dist_error} type='number' min='0' step='0.5' help='Maximum distance error, in meters. Higher values give higher compression rates but also more deviations from the original track' />
                <TextField title='Max. speed error'  onChange={(value) => setState({...state, simplification: {...state.simplification, max_speed_error: value}})} defaultValue={config.simplification.max_speed_error} type='number' min='0' step='0.5' help='Maximum speed error, in km/h. Higher values give higher compression rates but also more deviations from the original track' />
                <TextField title='Epsilon'  onChange={(value) => setState({...state, simplification: {...state.simplification, eps: value}})} defaultValue={config.simplification.eps} type='number' min='0' step='0.1' help='Maximum distance, in degrees, to compress a track solely based on its topology' />
              </>)
            }
          </SectionBlock>

          <SectionBlock name='Location suggestions'>
            <ToggleField title='Use' onChange={(e) => setState({...state, location: {...state.location, use: e.target.value}})} checked={config.location.use} />
            { (state.location ? state.location.use : config.location.use) && 
              (<>
                <TextField title='Max. distance to place' onChange={(value) => setState({...state, location: {...state.location, max_distance: value}})} defaultValue={config.location.max_distance} type='number' min='0' step='0.01' help='Radius to other locations, in meters, for them to be considered the same.' />
                <TextField title='Limit' onChange={(value) => setState({...state, location: {...state.location, limit: value}})} defaultValue={config.location.limit} type='number' min='0' step='0.01' help='Maximum suggestions to present for a location' />
                <ToggleField title='Use Google Location API' onChange={(e) => setState({...state, location: {...state.location, use_google: e.target.value}})} checked={config.location.use_google} help={
                  <span>
                    <a href='https://developers.google.com/places/web-service/'>Google Places API key</a> to query for place suggestions in LIFE file.
                  </span>
                } />
                <TextField title='Google Places API Key' onChange={(value) => setState({...state, location: {...state.location, google_key: value}})} defaultValue={config.location.google_key}/>
                <ToggleField title='Use Foursquare Location API' onChange={(e) => setState({...state, location: {...state.location, use_foursquare: e.target.value}})} checked={config.location.use_foursquare} help={
                  <span>
                    <a href='https://developer.foursquare.com/docs/places-api-overview/'>Foursquare Places API key</a> to query for place suggestions in LIFE file.
                  </span>
                } />
                <TextField title='Foursquare Places API Key' onChange={(value) => setState({...state, location: {...state.location, foursquare_key: value}})} defaultValue={config.location.foursquare_key}/>
              </>)
            }
          </SectionBlock>
        </div>
      );
    }

    return (
      <Card width={400} title={"Settings"} verticalOffset={1} horizontalOffset={1}>
        <section style={{ flexGrow: 1, overflowY: 'auto', maxHeight: '460px'}}>
          <div style={{ maxWidth: '400px', margin: 'auto' }}>
            <SectionBlock name='Server'>
              <TextField title='Server' defaultValue={address} onChange={(value) => setState({...state, address: value})} />
            </SectionBlock>

            { serverSpecific }

          </div>
        </section>
        <footer style={{ textAlign: 'right', paddingTop: '10px' }} className='control'> 
          <AsyncButton 
            title='Bulk Upload All Tracks In Input Folder' 
            className={bulkClassName}
            style={{float: "left"}}
            disabled={isBulkProcessing} 
            showStatus={isBulkProcessing} 
            statusPercentage={bulkProgress} 
            onClick={onBulkClick}>
              <DownloadingIcon style={{marginRight: '10px'}}/>
              Bulk Track Upload
          </AsyncButton>
          <AsyncButton 
            title='Save Configuration Settings'
            className='is-blue'
            onClick={(e, modifier) => {
              modifier('is-loading')
              onSubmit()
              modifier()}} >
                 Save 
              <SaveIcon style={{marginLeft: '10px'}}/>
          </AsyncButton>
        </footer>
      </Card>
    );
}

const mapStateToProps = (state) => {
  const serverConfig = state.get('general').get('config');
  return {
    address: state.get('general').get('server'),
    config: serverConfig ? serverConfig.toJS() : null,
    isLoading: state.get('general').get('loading').has('config'),
    isVisible: state.get('general').get('isUIVisible'),
    isBulkProcessing: state.get('process').get('isBulkProcessing'),
    bulkProgress: state.get('process').get('bulkProgress'),
  };
}

Settings.propTypes ={
  /** Redux store action dispatcher*/
  dispatch: PropTypes.func, 
  /** Server address */
  address: PropTypes.string, 
  /** Current configurations state */
  config: PropTypes.object, 
  /** Whether configurations file is being loaded from server */
  isLoading: PropTypes.bool, 
  /** Determines if view UI components are visible */
  isVisible: PropTypes.bool, 
  /** Whether tracks are currently being uploaded in bulk */
  isBulkProcessing: PropTypes.bool, 
  /** Percentage of tracks that have already been processed (when bulk processing) */
  bulkProgress: PropTypes.number 
}

export default connect(mapStateToProps)(Settings);

