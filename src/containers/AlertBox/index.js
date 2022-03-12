import React from 'react';
import { connect } from 'react-redux';
import { removeAlert } from '../../actions/general';

const mapType = {
  'warning': 'is-warning',
  'success': 'is-success',
  'error': 'is-danger'
};

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

export default AlertBox;