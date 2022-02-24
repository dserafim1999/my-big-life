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

  createClassName (additional, filter = () => (true)) {
    const { disabled, className, withoutBtnClass } = this.props;
    return [withoutBtnClass ? null : 'button', disabled ? 'is-disabled' : null, className, additional]
      .filter(filter)
      .join(' ');
  }

  onClick (e) {
    if (this.props.onClick) {
      this.props.onClick(e, (className, filter) => {
        findDOMNode(this.btnRef.current).className = this.createClassName(className, filter)
      });
    }
  }

  onFileRead (text) {
    if (this.props.onRead) {
      this.props.onRead(text, (className, filter) => {
        findDOMNode(this.btnRef.current).className = this.createClassName(className, filter);
      })
    }
  }

  render () {
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
       <div className={classes} ref={this.btnRef}>
          <input type='file' id={id} style={{display: 'none'}} onChange={onChange}/>
          <label htmlFor={id}>
            { this.props.children }
          </label>
        </div>
      )
    } else if (this.props.isDiv) {
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
