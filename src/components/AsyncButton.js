import React, { Component, createRef } from 'react';
import { findDOMNode } from 'react-dom';

export default class AsyncButton extends Component {
  constructor (props) {
    super(props);
    this.btnRef = createRef();
    this.state = {
      className: '',
      content: this.props.children
    };
  }

  createClassName (additional) {
    return ['button', this.props.disabled ? 'is-disabled' : null, this.props.className, additional]
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
    return (
      <a className={classes} onClick={this.onClick.bind(this)} ref={this.btnRef}>
        { this.state.content }
      </a>
    );
  }
}
