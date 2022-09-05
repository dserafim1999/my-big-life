import React, { useState } from 'react';

import PropTypes from 'prop-types';

import Overlay from '../Overlay';

/**
 * Container that performs a certain operation with files that are dropped onto the screen.
 * 
 * @constructor
 * @param {function} onDrop Behaviour when files are dropped onto the screen
 * @param {function} onHover Behaviour when files are hovering over the screen
 * @param {boolean} canDropFiles Determines whether files can be dropped onto the screen
 * @param {any} children
 */

const Dropzone = ({ children, onDrop, onOver, canDropFiles, ...props }) => {
  if (!canDropFiles) return children;

  const [isDragging, setIsDragging] = useState(false);

  const drop = (e) => {
    e.preventDefault()

    if (onDrop) {
      onDrop(e)
    }

    setIsDragging(false);
  }

  const cancel = (e) => {
    e.preventDefault()
    if (onOver) {
      onOver(e)
    }
    return false
  }

  const onDragEnter = (e) => {
    e.preventDefault();
    if (onOver) {
      onOver(e)
    }
    setIsDragging(true);
  }

  const onDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false);
    ;
  }

  return (
    <>
      { isDragging && (
          <Overlay onDrop={drop} onDragOver={cancel} onDragLeave={onDragLeave}>
            <div style={{display: 'table', border: '5px dashed white', width: '95%', height: '95%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
              <p style={{display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', color: 'white', fontSize: '20px'}}> Drop your .gpx or .life files here!</p>
            </div>
          </Overlay>
        )
      }
      <div {...props} onDragEnter={onDragEnter}>
        { children }
      </div>
    </>
  )
}

Dropzone.propTypes = {
  /** Behaviour when files are dropped onto the screen */
  onDrop: PropTypes.func,
  /** Behaviour when files are hovering over the screen */
  onHover: PropTypes.func,
  /** Determines whether files can be dropped onto the screen */
  canDropFiles: PropTypes.bool,
  children: PropTypes.any
}

export default Dropzone
