import React, { useState } from 'react'

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
          <div id="dropOverlay" onDrop={drop} onDragOver={cancel} onDragLeave={onDragLeave}>
            <div style={{display: 'table', border: '5px dashed white', width: '95%', height: '95%', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
              <p style={{display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', color: 'white', fontSize: '20px'}}> Drop your .gpx or .life files here!</p>
            </div>
          </div>
        )
      }
      <div {...props} onDragEnter={onDragEnter}>
        { children }
      </div>
    </>
  )
}

export default Dropzone
