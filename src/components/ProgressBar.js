import React from 'react';

let ProgressBar = ({ state, children }) => {
  const none = {};
  const active = { className: 'active' };
  const highlight = { className: 'hl' };
  const TIP_SIZE = 0;
  const width = ((100 - TIP_SIZE) / 5) + '%';

  const selector = (current, index) => {
    if (current === index) {
      return highlight;
    } else if (current > index) {
      return active;
    } else {
      return none;
    }
  }

  return (
    <div className='status-container'>
      <div>
        <ul className='progressbar'>
          <li { ...active } style={{ width }} key={0}></li>
          <li { ...selector(state, 0) } style={{width}} key={1}></li>
          <li { ...selector(state, 1) } style={{width}} key={2}></li>
          <li { ...selector(state, 2) } style={{width}} key={3}></li>
          <li { ...none } style={{width}} key={4}></li>
        </ul>
      </div>
      <div className='pg-text'>
        <span { ...selector(state, 0) }>Preview</span>
        <span { ...selector(state, 1) }>Adjust</span>
        <span { ...selector(state, 2) }>Annotate</span>
      </div>
    </div>
  );
}

const STEPS = [
  { name: 'Preview' },
  { name: 'Adjust' },
  { name: 'Annotate' }
];

const ProgressBall = ({ style }) => {
  return (
    <div style={{ ...style, borderRadius: '50%' }}></div>
  );
}

const ProgressRuler = ({ style }) => {
  const _style = { flexGrow: 2, display: 'inline-block' };
  return (
    <div style={_style}>
      <div style={{ backgroundColor: 'white', width: '110%', height: '5px', marginLeft: '-5%', ...style }}>
      </div>
    </div>
  );
}

const BALL_STYLE = {
  width: '16px',
  height: '16px',
  display: 'inline-block',
  backgroundColor: 'white',
  zIndex: 100
};

ProgressBar = ({ state, ballStyle, children }) => {
  ballStyle = ballStyle || BALL_STYLE;
  const borderColor = '#97cd76';

  const p = 20;
  const rulerBeforeStyle = { background: borderColor };
  const rulerAfterStyle = { background: '#c3c3c3' };
  const rulerSelectedStyle = { background: 'linear-gradient(to right, ' + borderColor + ' 0%,' + borderColor + ' ' + p + '%,#c3c3c3 ' + p + '%,#c3c3c3 100%)' };

  const ballAfterStyle = { ...ballStyle, border: '4px solid lightgrey', backgroundColor: 'white' };
  const ballSelectedStyle = { ...ballStyle, border: '4px solid ' + borderColor, width: '20px', height: '20px' };
  const ballBeforeStyle = { ...ballStyle, border: '4px solid ' + borderColor, backgroundColor: borderColor };

  const labelBaseStyle = { color: 'rgba(0, 0, 0, 0.5)', fontWeight: 'bold' };
  const labelBeforeStyle = labelBaseStyle;
  const labelAfterStyle = labelBeforeStyle;
  const labelSelectedStyle = { ...labelBaseStyle, color: 'black' };

  const Spacer = ( i ) => {
    <div style={{ flexGrow: 2 }} key={i}></div>;
  }

  const _steps = STEPS.reduce((prev, step, i) => {
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
              return Spacer(i);
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
  const equalSize = (100 / STEPS.filter((s) => s && s.name).length) + '%';

  const stepLabels = (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {
        STEPS.reduce((result, step, i) => {
          if (step) {
            let stl = labelBeforeStyle;
            const s = i;
            if (state === s) {
              stl = labelSelectedStyle;
            } else if (state < s) {
              stl = labelAfterStyle;
            }
            result.push(
              <div style={{ flexGrow: 2, textAlign: 'center', width: forceEqualSize ? equalSize : null, ...stl }} key={i}>{ step.name }</div>
            );
            if (STEPS.length - 1 !== i) {
              result.push(Spacer(i));
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

export default ProgressBar;