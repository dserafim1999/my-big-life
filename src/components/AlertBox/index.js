import React from 'react';

import ImmutablePropTypes  from 'react-immutable-proptypes';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { removeAlert } from '../../actions/general';

const mapType = {
  'warning': 'is-warning',
  'success': 'is-success',
  'error': 'is-danger'
};

/**
 * Container that houses alerts that are active in the state, displaying them at the top of the screen.
 * 
 * @constructor
 * @param {function} dispatch Redux store action dispatcher
 * @param {ImmutablePropTypes.List} alerts Immutable List containing alert objects (duration, type, ref and message)
 */

let AlertBox = ({ dispatch, alerts }) => {
  const style = {
    position: 'absolute',
    top: '10px',
    left: '50%',
    width: '50%',
    marginLeft: '-25%',
    zIndex: 1000
  };

  const deleteAlert = (alert) => {
    dispatch(removeAlert(alert));
  };

  return (
    <div style={style}>
      {
        alerts.map((alert, i) => {
          setTimeout(() => deleteAlert(alert), alert.duration * 1000);
          return (
            <div className={'notification slide-from-top-fade-in ' + mapType[alert.type]} key={i}>
              <button className='delete' onClick={() => deleteAlert(alert)}></button>
              { alert.message }
            </div>
          );
        })
      }
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    alerts: state.get('general').get('alerts') || []
  }
}

AlertBox = connect(mapStateToProps)(AlertBox);

AlertBox.propTypes = {
  /** Redux store action dispatcher */
  dispatch: PropTypes.func,
  /** Immutable List containing alert objects (duration, type, ref and message) */
  alerts: ImmutablePropTypes.listOf(PropTypes.object)
};

export default AlertBox;