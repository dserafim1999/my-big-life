import React, { Component, createRef } from 'react';
import { findDOMNode } from 'react-dom';

export default class AsyncButton extends Component {
  constructor (props) {
    super(props);
    this.btnRef = createRef();
    this.state = {
      className: ''
    };
  }

  createClassName (additional) {
    const { disabled, className, withoutBtnClass } = this.props;
    return [withoutBtnClass ? null : 'button', disabled ? 'is-disabled' : null, className, additional]
      .filter((x) => x)
      .join(' ');
  }

  onClick (e) {
    if (this.props.onClick) {
      this.props.onClick(e, (className, content) => {
        findDOMNode(this.btnRef.current).className = this.createClassName(className)
      })
    }
  }

  render () {
    const classes = this.createClassName();
    if (this.props.isDiv) {
      return (
        <div className={classes} onClick={this.onClick.bind(this)} ref={this.btnRef}>
          { this.props.children }
        </div>
      );
    } else {
      return (
        <a className={classes} onClick={this.onClick.bind(this)} ref={this.btnRef}>
          { this.props.children }
        </a>
      );
    }
  }
}
