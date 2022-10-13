import React from 'react';
import PropTypes from 'prop-types';

const BALL_DEFAULT_STYLE = {
  width: '16px',
  height: '16px',
  display: 'inline-block',
  backgroundColor: 'white',
  zIndex: 100
};

/**
 * Ball reflecting current processing step in ProgressBar
 * 
 * @param {object} style Aditional CSS styling for component
 */
const ProgressBall = ({ style }) => {
  const stl = {
    ...style,
    borderRadius: '50%'
  };

  return (
    <div style={stl}></div>
  );
}

/**
 * Line reflecting processing steps in ProgressBar
 * 
 * @param {object} style Aditional CSS styling for component
 */
const ProgressRuler = ({ style }) => {
  const _style = { flexGrow: 2, display: 'inline-block' };
  return (
    <div style={_style}>
      <div style={{ backgroundColor: 'white', width: '110%', height: '5px', marginLeft: '-5%', ...style }}>
      </div>
    </div>
  );
}

/**
 * Bar reflecting current processing step in Track Processing
 * 
 * @param {object} state Current processing step
 * @param {object} ballStyle Aditional CSS styling for ProgressBall 
 * @param {object} rulerStyle Aditional CSS styling for ProgressRuler 
 * @param {any} children
 */
const ProgressBar = ({ state, ballStyle, rulerStyle, children }) => {
  ballStyle = ballStyle || BALL_DEFAULT_STYLE;
  rulerStyle = rulerStyle;
  const borderColor = '#284760';

  const p = 10;
  const rulerBeforeStyle = { background: borderColor };
  const rulerAfterStyle = { background: '#c3c3c3' };
  const rulerSelectedStyle = { background: 'linear-gradient(to right, ' + borderColor + ' 0%,' + borderColor + ' ' + p + '%,#c3c3c3 ' + p + '%,#c3c3c3 100%)' };

  const ballAfterStyle = { ...ballStyle, border: '4px solid lightgrey', backgroundColor: 'white' };
  const ballSelectedStyle = { ...ballStyle, border: '4px solid ' + borderColor, width: '20px', height: '20px' };
  const ballBeforeStyle = { ...ballStyle, border: '4px solid ' + borderColor, backgroundColor: borderColor };

  const labelBaseStyle = { color: 'rgba(0, 0, 0, 0.25)', fontWeight: 'light' };
  const labelBeforeStyle = labelBaseStyle;
  const labelAfterStyle = labelBeforeStyle;
  const labelSelectedStyle = { ...labelBaseStyle, color: borderColor , fontWeight: 'bold' };

  const _steps = children.reduce((prev, step, i) => {
    prev.push(step);
    prev.push(null);
    return prev;
  }, [null]);

  const stepPointers = (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {
        _steps.map((step, i, arr) => {
          if (step) {
            let stl = ballBeforeStyle;
            const s = (i / 2) - 0.5;
            if (state === s) {
              stl = ballSelectedStyle;
            } else if (state < s) {
              stl = ballAfterStyle;
            }
            return (<ProgressBall style={stl} key={i}/>);
          } else {
            if (i === 0 || (arr.length - 1) === i) {
              return (
                <div style={{ flexGrow: 2 }} key={i}></div>
              );
            } else {
              let stl = rulerBeforeStyle;
              const s = (i / 2) - 1;
              if (state === s) {
                stl = rulerSelectedStyle;
              } else if (state < s) {
                stl = rulerAfterStyle;
              }
              return (<ProgressRuler style={stl} key={i}/>);
            }
          }
        })
      }
    </div>
  )

  const forceEqualSize = true;
  const equalSize = (100 / children.length) + '%';

  const stepLabels = (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {
        children.reduce((result, step, i) => {
          if (step) {
            let stl = labelBeforeStyle;
            const s = i;
            if (state === s) {
              stl = labelSelectedStyle;
            } else if (state < s) {
              stl = labelAfterStyle;
            }
            result.push(
              <div key={i + 'x'} style={{ flexGrow: 2, textAlign: 'center', width: forceEqualSize ? equalSize : null, ...stl }}>{ step }</div>
            );
            if (children.length - 1 !== i) {
              result.push(
                <div style={{ flexGrow: 2 }} key={i + '_'}></div>
              );
            }
          }
          return result;
        }, [])
      }
    </div>
  );

  return (
    <div>
      { stepPointers }

      { stepLabels }
    </div>
  );
}

ProgressBar.propTypes = {
  /** Current processing step */
  state: PropTypes.object,
  /** Aditional CSS styling for ProgressBall  */
  ballStyle: PropTypes.object,
  /** Aditional CSS styling for ProgressRuler  */
  rulerStyle: PropTypes.object,
  children: PropTypes.any
}

export default ProgressBar;