import React, { Component, createRef } from 'react';

import PropTypes from 'prop-types';

import { Tooltip } from '@mui/material';
import { findDOMNode } from 'react-dom';

const statusStyle = {
  height: '100%',
  position: 'absolute',
  right: 0,
  backgroundColor: 'rgb(0,0,0,0.5)',
  marginTop: '1px'
}

/**
 * Button with a loading spinner for async operations.
 * 
 * @constructor
 * @param {any} children Inner Content
 * @param {string} className Aditional CSS classes for button
 * @param {boolean} disabled Determines whether button is enabled or disabled
 * @param {function} onClick Behaviour when button is clicked
 * @param {object} style Aditional CSS styling for button
 * @param {string} title Tooltip text
 * @param {boolean} showStatus If enabled, a loading overlay will be displayed reflecting the async operation's status
 * @param {number} statusPercentage Value used to represent status percentage if showStatus is active
 */
export default class AsyncButton extends Component {
  constructor (props) {
    super(props);

    this.title = props.title !== undefined ? props.title : '';
    this.btnRef = createRef();
    this.state = {
      className: '',
      content: null
    };
  }

  static propTypes = {
    /** Inner content */
    children: PropTypes.any,
    /** Aditional CSS classes for button */
    className: PropTypes.string,
    /** Determines whether button is enabled or disabled */
    disabled: PropTypes.bool,
    /** Behaviour when button is clicked */
    onClick: PropTypes.func,
    /** Aditional CSS styling for button */
    style: PropTypes.object,
    /** Tooltip text */
    title: PropTypes.string,
    /** If enabled, a loading overlay will be displayed reflecting the async operation's status */
    showStatus: PropTypes.bool, 
    /** Value used to represent status percentage if showStatus is active */
    statusPercentage: PropTypes.number 
  }

  createClassName (additional, filter = () => (true)) {
    const { disabled, className, withoutBtnClass } = this.props;
    return [withoutBtnClass ? null : 'button', disabled ? 'is-disabled' : null, className, additional]
      .filter(filter)
      .join(' ');
  }

  onClick (e) {
    if (this.props.onClick && !this.props.disabled) {
      this.props.onClick(e, (className, filter, content) => {
        const button = findDOMNode(this.btnRef.current);
        
        if (button !== null){
          button.className = this.createClassName(className, filter);
        }

        this.state.content = content;
        this.setState(this.state);
      });
    }
  }

  onFileRead (text) {
    if (this.props.onRead) {
      this.props.onRead(text, (className, filter) => {
        const button = findDOMNode(this.btnRef.current);
        
        if (button !== null){
          button.className = this.createClassName(className, filter);
        }
      })
    }
  }

  render () {
    const { style } = this.props;
    const classes = this.createClassName();

    if (this.props.isFile) {
      const id='fkdhf';
      const onChange = (evt) => {
        const files = evt.target.files; // FileList object

        // Loop through the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {
          var reader = new FileReader();
          // Closure to capture the file information.
          reader.onload = ((theFile) => {
            return (e) => {
              const text = e.currentTarget.result;
              this.onFileRead(text);
            }
          })(f);

          // read text
          reader.readAsText(f);
        }
      }

      return (
       <div style={style} className={classes} ref={this.btnRef}>
          <input type='file' id={id} style={{display: 'none'}} onChange={onChange}/>
          <label htmlFor={id}>
            { this.props.showStatus && 
              <div style={{...statusStyle, width: (100 - this.props.statusPercentage) + '%'}}/>
            }
            { this.props.children }
          </label>
        </div>
      )
    } else if (this.props.isDiv) {
      return (
        <Tooltip title={this.title}  placement={this.props.tooltipPlacement !== undefined ? this.props.tooltipPlacement : 'top' } >  
          <div style={style} className={classes} onClick={this.onClick.bind(this)} ref={this.btnRef}>
            { this.props.showStatus && 
              <div style={{...statusStyle, width: (100 - this.props.statusPercentage) + '%'}}/>
            }
            { this.props.children }
          </div>
        </Tooltip>
      );
    } else {
      return (
        <Tooltip title={this.title}  placement={this.props.tooltipPlacement !== undefined ? this.props.tooltipPlacement : 'top'} >  
          <a style={style} className={classes} onClick={this.onClick.bind(this)} ref={this.btnRef}>
            { this.props.showStatus && 
              <div style={{...statusStyle, width: (100 - this.props.statusPercentage) + '%'}}/>
            }
            { this.props.children }
          </a>
        </Tooltip>
      );
    }
  }
}
