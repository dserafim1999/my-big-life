import React, { Component } from 'react';

import Date from 'moment';
import ReactSlider from 'react-slider';
import PropTypes from 'prop-types';
import moment from 'moment';

/**
 * Time Range Slider to filter dates.
 * 
 * @constructor
 * @param {Date} start Start time
 * @param {Date} end End time
 * @param {Date} initialStart Filter start time
 * @param {Date} initialEnd Filter end time
 * @param {function} onChange Behaviour when time value is changed
 */
export default class TimeSlider extends Component {
  constructor (props) {
    super(props);
    const start = this.props.start.valueOf();
    const diff = this.props.end.diff(this.props.start);

    let left = 0;
    if (this.props.initialStart) {
      left = ((this.props.initialStart.valueOf() - start) / diff) * 100;
    }

    
    let right = 100;
    if (this.props.initialEnd) {
      right = ((this.props.initialEnd.valueOf() - start) / diff) * 100;
    }
    
    this.state = {
      left,
      right
    }
  }

  static propTypes = {
    /** Start time */
    start: PropTypes.instanceOf(Date),
    /** End time */
    end: PropTypes.instanceOf(Date),
    /** Filter start time */
    initialStart: PropTypes.instanceOf(Date),
    /** Filter end time */
    initialEnd: PropTypes.instanceOf(Date),
    /** Behaviour when time value is changed */
    onChange: PropTypes.func
  }

  onChange (value) {
    this.setState({
      left: value[0],
      right: value[1]
    });
    
    if (this.props.onChange) {
      const { lower, upper } = this.getDates();
      this.props.onChange(lower, upper)
    }
  }

  getDates () {
    const start = this.props.start.valueOf();
    const diff = this.props.end.diff(this.props.start);

    const leftRatio = this.state.left / 100;
    const rightRatio = this.state.right / 100;
    
    const lower = moment(start + diff * leftRatio);
    const upper = moment(start + diff * rightRatio);
    
    return {
      lower,
      upper
    }
  }

  render () {
    const { lower, upper } = this.getDates();

    return (
      <div style={{ fontSize: '0.8rem' }}>
        <ReactSlider 
            defaultValue={[this.state.left, this.state.right]} 
            withBars 
            thumbClassName='handle'
            className='slider'
            onAfterChange={this.onChange.bind(this)} 
         />
        <div className='navbar'>
          <div className='navbar-left'>
            { lower.format('LTS') }
          </div>
          <div className='navbar-right'>
            { upper.format('LTS') }
          </div>
        </div>
      </div>
    );
  }
}