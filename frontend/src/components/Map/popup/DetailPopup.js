import React, { Component } from 'react';
import moment from 'moment';
import haversine from '../../../utils/haversine';

import LeftIcon from '@mui/icons-material/ChevronLeft';
import RightIcon from '@mui/icons-material/ChevronRight';

import AsyncButton from '../../../components/Buttons/AsyncButton';

const flexAlignStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  margin: 'auto'
}

const formatTime = (t) => t.format('YYYY-MM-DDTHH:mm:ss');

const PointMetrics = ({ current, previous, next, index }) => {
  const ballStyle = {
    border: '2px solid #000',
    borderRadius: '50%',
    width: '10px',
    height: '10px',
    display: 'inline-block'
  }

  const rulerStyle = {
    textAlign: 'center',
    flexGrow: 1
  }

  const centerBallStyle = {
    ...ballStyle,
    borderWidth: '4px'
  }

  const rulerInStyle = {
    border: '1px black solid'
  }

  const buildMetrics = (before, after) => {
    if (before && after) {
      const dt = after.get('time').diff(before.get('time'), 'seconds');
      const dx = haversine(before.get('lat'), before.get('lon'), after.get('lat'), after.get('lon')) * 1000;
      
      if (before.get('time') && after.get('time')) {
        const dt = after.get('time').diff(before.get('time'), 'seconds');
        const vel = (dx / 1000) / (dt / 3600);

        return {
          distances: (
            <div>
              <strong>{ dx.toFixed(2) }m</strong> in <strong>{ dt }s</strong>
            </div>
          ),
          velocity: (
            <div>
              <strong>{ vel.toFixed(2) }km/h</strong>
            </div>
          )
        }
      } else {
        return {
          distances: (
            <div>
              <strong>{ dx.toFixed(2) }m</strong>
            </div>
          ),
          velocity: (
            <div style={{ height: '1rem' }}>&nbsp;</div>
          )
        }
      }
    } else {
      return {
        distances: null,
        velocity: null
      }
    }
  }

  const buildRuler = (before, after, opacity = 0.5) => {
    const complement = (before && after) ? {} : { borderStyle: 'dashed', opacity };
    const { distances, velocity } = buildMetrics(before, after);

    return (
      <div style={{ ...rulerStyle, ...complement }}>
        { distances }
        <div style={{ ...rulerInStyle, ...complement }}></div>
        { velocity }
      </div>
    );
  }

  const indexStyle = {
    fontWeight: 'bold',
    flexGrow: 1
  }

  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '-4px' }}>
        <div style={{ ...indexStyle, textAlign: 'left', opacity: 0.7 }}>{ previous ? '#' + (index - 1) : '' }</div>
        <div style={{ ...indexStyle, textAlign: 'center' }}>#{ index }</div>
        <div style={{ ...indexStyle, textAlign: 'right', opacity: 0.7 }}>{ next ? '#' + (index + 1) : '' }</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ ...ballStyle, opacity: previous ? 1 : 0.5 }}></div>
        { buildRuler(previous, current, 0.5) }
        <div style={centerBallStyle}></div>
        { buildRuler(current, next, 0.5) }
        <div style={{ ...ballStyle, opacity: next ? 1 : 0.5 }}></div>
      </div>
    </div>
  );
}

class EditPoint extends Component {
  constructor (props) {
    super(props);
    this.state = {
      lat: this.props.current.get('lat'),
      lon: this.props.current.get('lon'),
      time: this.props.current.get('time'),
      validationError: ' '
    }
  }

  onChange (prop, e) {
    const { value } = e.target;
    switch (prop) {
      case 'lat':
      case 'lon':
        this.state[prop] = parseFloat(value);
        break;
      case 'time':
        this.state[prop] = moment(value);
        this.validateDate(e, false);
        break;
    }
    this.setState(this.state);
  }

  validateDate (e, change = true) {
    const { value } = e.target;
    const { previousPoint, nextPoint } = this.props;
    const currentValue = moment(value);
    if (previousPoint && previousPoint.get('time').valueOf() > currentValue) {
      this.state.validationError = 'Time must be ' + formatTime(previousPoint.get('time')) + ' or higher';
      if (change) {
        this.state.time = previousPoint.get('time').clone();
        this.setState(this.state);
      }
    } else if (nextPoint && currentValue > nextPoint.get('time').valueOf()) {
      this.state.validationError = 'Time must be ' + formatTime(nextPoint.get('time')) + ' or lower';
      if (change) {
        this.state.time = nextPoint.get('time').clone();
        this.setState(this.state);
      }
    } else {
      if (this.state.validationError !== ' ') {
        this.state.validationError = ' ';
        this.setState(this.state);
      }
    }
  }

  onReset () {
    const { lat, lon, time } = this.props.current.toJS();
    this.setState({ lat, lon, time });
  }

  hasChanged () {
    if (this.state.time) {
      return this.state.lat !== this.props.current.get('lat') ||
        this.state.lon !== this.props.current.get('lon') ||
        !this.state.time.isSame(this.props.current.get('time'));
    } else {
      return this.state.lat !== this.props.current.get('lat') ||
        this.state.lon !== this.props.current.get('lon');
    }
  }

  onSave (e, modifier) {
    const { lat, lon, time } = this.state;
    this.props.onSave(lat, lon, time);
    modifier('is-loading');
    setTimeout(() => modifier(), 1000);
  }

  onDelete (e, modifier) {
    this.props.onDelete();
  }

  render () {
    const { onSave, current, previousPoint, nextPoint, index, editable } = this.props;
    const { lat, lon, time } = this.state;

    const datetime = time ? formatTime(time) : null;
    const datetimeMin = previousPoint && time ? formatTime(previousPoint.get('time')) : null;
    const datetimeMax = nextPoint && time ? formatTime(nextPoint.get('time')) : null;

    const labelStyle = {};

    const controlStyle = {
      marginBottom: '2px'
    }
    return (
      <div>
        <PointMetrics current={current} previous={previousPoint} next={nextPoint} index={index} />

        <div className='control is-horizontal' style={controlStyle}>
          <div className='control-label' style={labelStyle}>
            <label className='label is-small'>Lat</label>
          </div>
          <div className='control is-fullwidth'>
            {
              editable
              ? <input type='number' className='input is-small' value={lat} onChange={this.onChange.bind(this, 'lat')} />
              : <div style={{ fontSize: '1.1rem' }}>{lat}</div>
            }
          </div>
        </div>
        <div className='control is-horizontal' style={controlStyle}>
          <div className='control-label' style={labelStyle}>
            <label className='label is-small'>Lon</label>
          </div>
          <div className='control is-fullwidth'>
            {
              editable
              ? <input type='number' className='input is-small' value={lon} onChange={this.onChange.bind(this, 'lon')} />
              : <div style={{ fontSize: '1.1rem' }}>{lon}</div>
            }
          </div>
        </div>

        {
          time
          ? (
            <div className='control is-horizontal' style={controlStyle}>
              <div className='control-label' style={labelStyle}>
                <label className='label is-small'>Time</label>
              </div>
              <div className='control is-fullwidth'>
                {
                  editable
                    ? (
                      <input
                        type='datetime-local'
                        min={datetimeMin}
                        max={datetimeMax}
                        className='input is-small'
                        value={datetime}
                        onChange={this.onChange.bind(this, 'time')}
                        onBlur={this.validateDate.bind(this)}
                        step={1} />
                      )
                    : <div style={{ fontSize: '1.1rem' }}>{datetime}</div>
                }
              </div>
            </div>
          )
          : null
        }

        <div style={{ color: '#cb4b16', fontSize: '0.9em', textAlign: 'right' }}>{ this.state.validationError }</div>
        {
          editable
          ? (
            <div className='has-text-right'>
              <a className='button is-light is-small' style={{float: 'left'}} onClick={this.onReset.bind(this)}>Reset</a>
              <AsyncButton title='Delete Point' className={'button is-red is-small' + (!this.hasChanged() ? ' is-disabled' : '')} onClick={this.onDelete.bind(this)}>
                Delete
              </AsyncButton>
              <AsyncButton title='Save changes' className={'button is-blue is-small' + (!this.hasChanged() ? ' is-disabled' : '')} onClick={this.onSave.bind(this)}>
                Save
              </AsyncButton>
            </div>
            )
          : null
        }

      </div>
    );
  }
}

const DetailPopup = ({ current, next, previous, i, onMove, editable, onSave, onDelete }) => {
  const styleLeft = Object.assign({}, flexAlignStyle, { opacity: previous ? 1 : 0.5 });
  const styleRight = Object.assign({}, flexAlignStyle, { opacity: next ? 1 : 0.5 });

  return (
    <div style={{ width: '320px', display: 'flex' }}>
      <LeftIcon sx={{ fontSize: 40 }} className='clickable' style={styleLeft} onClick={() => (previous ? onMove(i - 1) : null)} />
      <div style={{ flexGrow: 1 }}>
        <EditPoint
          current={current}
          nextPoint={next}
          previousPoint={previous}
          index={i + 1}
          editable={editable}
          onSave={onSave} 
          onDelete={onDelete} />
      </div>
      <RightIcon sx={{ fontSize: 40 }} className='clickable' style={styleRight} onClick={() => (next ? onMove(i + 1) : null)}/>
    </div>
  );
}

export default DetailPopup;
