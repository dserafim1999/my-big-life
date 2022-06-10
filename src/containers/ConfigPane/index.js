import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { saveConfig, getConfig, updateServer } from '../../actions/general';

import Card from '../Card';
import AsyncButton from '../../components/Buttons/AsyncButton';
import { TextField, ToggleField, OptionsField, SectionBlock } from '../../components/Form';

const ConfigPane = ({ dispatch, address, config, isLoading }) => {
    useEffect( () => {
      dispatch(getConfig(dispatch));
      console.log(address)
   }, []);

    const [state, setState] = useState({...config, address: address});

    const onSubmit = (e) => {
      // e.preventDefault()
  
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
          </SectionBlock>

          <SectionBlock name='Folders'>
            <TextField title='Input folder' onChange={(e) => setState({...state, input_path: e.target.value})} defaultValue={config.input_path} help='Path to the folder containing tracks to be processed' />
            <TextField title='Destination folder' onChange={(e) => setState({...state, output_path: e.target.value})} defaultValue={config.output_path} help='Path to folder where the processed tracks wil be saved' />
            <TextField title='Backup folder' onChange={(e) => setState({...state, backup_path: e.target.value})} defaultValue={config.backup_path} help='Path to the folder where the original tracks will be saved' />
            <TextField title='LIFE folder' onChange={(e) => setState({...state, life_path: e.target.value})} defaultValue={config.life_path} help='Path to the folder where each LIFE annotation will be saved. One file per day.' />
            <TextField title='LIFE file' onChange={(e) => setState({...state, life_all: e.target.value})} defaultValue={config.life_all} help='Path to the global file where LIFE annotations are stored. One file contains multiple days. Created if it does not exists.' />
          </SectionBlock>

          <SectionBlock name='Database'>
            <TextField title='Database host' onChange={(e) => setState({...state, db: {...state.db, host: e.target.value}})} defaultValue={config.db.host}/>
            <TextField title='Database name' onChange={(e) => setState({...state, db: {...state.db, name: e.target.value}})} defaultValue={config.db.name}/>
            <TextField title='Database username' onChange={(e) => setState({...state, db: {...state.db, user: e.target.value}})} defaultValue={config.db.user}/>
            <TextField title='Database password' onChange={(e) => setState({...state, db: {...state.db, pass: e.target.value}})} defaultValue={config.db.pass}/>
          </SectionBlock>

          <SectionBlock name='To trip'>
            <TextField title='Trip name format' onChange={(e) => setState({...state, trip_name_format: e.target.value})} defaultValue={config.trip_name_format} help={
              <span>Format of a trip. It is possible to use <a href='https://docs.python.org/2/library/datetime.html#strftime-strptime-behavior'>date formating</a>.</span>
            } />
          </SectionBlock>

          <SectionBlock name='Smoothing'>
            <ToggleField title='Use'  onChange={(e) => setState({...state, smoothing: {...state.smoothing, use: e.target.value}})} checked={config.smoothing.use}/>
            <OptionsField title='Algorithm' onChange={(e) => setState({...state, smoothing: {...state.smoothing, algorithm: e.target.value}})} options={[{ label: 'Kalman with backwards pass', key: 'inverse' }, { label: 'Kalman with start interpolation', key: '' }]} defaultValue={config.smoothing.algorithm} help={
              <span>
                <p>Algorithm to use to smooth tracks. There are two possibilities:</p>
                <b> - Kalman with backwards pass</b>: applied the kalman filter two times. One from the start to the end, then from the end to the start. Then, each one are cut in half and spliced together. This method provides better results, but requires more time.
                <br></br>
                <b> - Kalman with start interpolation</b>: applied the kalman filter one times, but first extrapolates the begining of the track.
              </span>
            } />
            <TextField title='Noise' onChange={(e) => setState({...state, smoothing: {...state.smoothing, noise: e.target.value}})} defaultValue={config.smoothing.noise} type='number' min='1' step='1' help='Noise of the points in the track. Higher values yield smoother tracks. If the value is 1 then it is not smoothed.' />
          </SectionBlock>

          <SectionBlock name='Spatiotemporal segmetation'>
            <ToggleField title='Use' onChange={(e) => setState({...state, segmentation: {...state.segmentation, use: e.target.value}})} checked={config.segmentation.use} />
            <TextField title='Epsilon' onChange={(e) => setState({...state, segmentation: {...state.segmentation, epsilon: e.target.value}})} defaultValue={config.segmentation.epsilon} type='number' min='0' step='0.01' help='Distance epsilon after which points can be clustered into the same stop. Points are clustered based on their spatiotemporal distance. The higher it is the less clusters will exist.'/>
            <TextField title='Min. time' onChange={(e) => setState({...state, segmentation: {...state.segmentation, min_time: e.target.value}})} defaultValue={config.segmentation.min_time} type='number' min='0' step='1' help='Minimum time at one place to consider it a stop' />
          </SectionBlock>

          <SectionBlock name='Simplification'>
            <ToggleField title='Use' onChange={(e) => setState({...state, simplification: {...state.simplification, use: e.target.value}})} checked={config.simplification.use} />
            <TextField title='Max. distance error' onChange={(e) => setState({...state, simplification: {...state.simplification, max_dist_error: e.target.value}})} defaultValue={config.simplification.max_dist_error} type='number' min='0' step='0.5' help='Maximum distance error, in meters. Higher values give higher compression rates but also more deviations from the original track' />
            <TextField title='Max. speed error'  onChange={(e) => setState({...state, simplification: {...state.simplification, max_speed_error: e.target.value}})} defaultValue={config.simplification.max_speed_error} type='number' min='0' step='0.5' help='Maximum speed error, in km/h. Higher values give higher compression rates but also more deviations from the original track' />
            <TextField title='Epsilon'  onChange={(e) => setState({...state, simplification: {...state.simplification, eps: e.target.value}})} defaultValue={config.simplification.eps} type='number' min='0' step='0.1' help='Maximum distance, in degrees, to compress a track solely based on its topology' />
          </SectionBlock>

          <SectionBlock name='Location inferring'>
            <TextField title='Max. distance to place' onChange={(e) => setState({...state, location: {...state.location, max_distance: e.target.value}})} defaultValue={config.location.max_distance} type='number' min='0' step='0.01' help='Radius to other locations, in meters, for them to be considered the same.' />
            <TextField title='Limit' onChange={(e) => setState({...state, location: {...state.location, limit: e.target.value}})} defaultValue={config.location.limit} type='number' min='0' step='0.01' help='Maximum suggestions to present for the location' />
            <TextField title='Min samples' onChange={(e) => setState({...state, location: {...state.location, min_samples: e.target.value}})} defaultValue={config.location.min_samples} type='number' min='0' step='1' />
            <TextField title='Google Places key' onChange={(e) => setState({...state, location: {...state.location, google_key: e.target.value}})} defaultValue={config.location.google_key} help={
              <span>
                <a href='https://developers.google.com/places/web-service/'>Google Places API key</a> to query for unknown places.
              </span>
            } />
          </SectionBlock>

          <SectionBlock name='Transportation inferring'>
            <TextField title='Min. time' onChange={(e) => setState({...state, transportation: {...state.transportation, min_time: e.target.value}})} defaultValue={config.transportation.min_time} type='number' min='0' step='0.01' help='Minimum time between changes of transportation mode, in seconds.' />
            <TextField title='Classifier path' onChange={(e) => setState({...state, transportation: {...state.transportation, classifier_path: e.target.value}})} defaultValue={config.transportation.classifier_path} help='Path to the file with the classifier to use when evaluating transportation modes' />
          </SectionBlock>

          <SectionBlock name='Trip learning'>
            <TextField title='Epsilon' onChange={(e) => setState({...state, trip_learning: {...state.trip_learning, epsilon: e.target.value}})} defaultValue={config.trip_learning.epsilon} type='number' min='0' step='0.01' />
          </SectionBlock>
        </div>
      );
    }

    return (
      <Card width={400} verticalOffset={1} horizontalOffset={1}>
        <h1 style={{margin: '10px 0px 20px'}}>Settings</h1>
        <section style={{ flexGrow: 1, overflowY: 'auto', maxHeight: '460px'}}>
          <div style={{ maxWidth: '400px', margin: 'auto' }}>
            <SectionBlock name='Server Address'>
              <TextField title='Server Address' defaultValue={address} onChange={(e) => setState({...state, address: e.target.value})} />
            </SectionBlock>

            { serverSpecific }

          </div>
        </section>
        <footer style={{ textAlign: 'right', paddingTop: '10px' }} className='control'> 
          <AsyncButton 
            title='Save Configuration Settings'
            onClick={(e, modifier) => {
              modifier('is-loading')
              onSubmit()
              modifier()
          }} > Save </AsyncButton>
        </footer>
      </Card>
    );
}

const mapStateToProps = (state) => {
  const serverConfig = state.get('general').get('config');
  return {
    address: state.get('general').get('server'),
    config: serverConfig ? serverConfig.toJS() : null,
    isLoading: state.get('general').get('loading').has('config')
  };
}

const CPane = connect(mapStateToProps)(ConfigPane);

export default CPane;
