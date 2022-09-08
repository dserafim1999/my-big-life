import { useState, useEffect } from 'react';

/**
 * Keeps track of component's dimensions.
 * 
 * @param {ReactRef} ref Ref of component to monitor dimensions 
 * @returns 
 */
const useDimensions = (ref) => {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
    useEffect(() => {
      const getDimensions = () => ({
        width: (ref && ref.current.offsetWidth) || 0,
        height: (ref && ref.current.offsetHeight) || 0,
      });
  
      const handleResize = () => {
        setDimensions(getDimensions());
      };
  
      if (ref.current) {
        setDimensions(getDimensions());
      }
  
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, [ref]);
  
    return dimensions;
}

export default useDimensions;