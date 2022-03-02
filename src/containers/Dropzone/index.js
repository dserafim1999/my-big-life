import React from 'react'

/*==================================
NOTE:
Container that triggers a certain function when 
a file is dropped into the div 
==================================*/

const Dropzone = (props) => {
  const { children, onDrop } = props;

  const drop = (e) => {
    e.preventDefault();

    if (onDrop) {
      onDrop(e);
    }
  }

  const cancel = (e) => {
    e.preventDefault();
    return false;
  }

  return (
    <div {...props} onDrop={drop} onDragOver={cancel} onDragEnter={cancel}>
      { children }
    </div>
  )
}

export default Dropzone;
