import { TextField } from "@mui/material";
import { Box } from "@mui/system";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { connect } from 'react-redux';
import { updateQueryBlock } from "../../actions/queries";

const QueryStay = ({id, startX, maxWidth, maxHeight, width, onChange, queryState, dispatch}) => {
    const height = 50;
    const minWidth = 125;
    const minHeight = 50;
    
    const inputStyle = {
      margin: '0 auto', 
      display: 'block', 
      position: 'relative',
      width: '30%',
      top: '50%',
      transform: 'translateY(-50%)'
    }

    const footerElementsStyle = {
      position: 'relative',
      top: '40%',
      display: 'flex',
      justifyContent: 'space-between'
    }

    const [state, setState] = useState({
        width: width,
        height: height,
        x: startX,
        y: (maxHeight - height) / 2 - 10
    });

    const [query, setQuery] = useState(queryState);

    useEffect(() => {
        dispatch(updateQueryBlock(query, id));
    },[query]);

    const onResizeStop = (e, direction, ref, delta, position) => {
        const maxHeightDelta = maxHeight - minHeight;
        const maxWidthDelta = maxWidth - minWidth;

        setState({
          width: ref.style.width,
          height: ref.style.height,
          ...position
        });
    }

    const onDragStop = (e, d) => { 
        setState({ x: d.x, y: d.y });
    }

    // return (
    //     <Rnd
    //       className="stayQuery"
    //       size={{ width: state.width, height: state.height }}
    //       position={{ x: state.x, y: state.y }}
    //       bounds="parent"
    //       minHeight={minHeight}
    //       minWidth={minWidth}
    //       dragAxis="x"
    //       onDragStop={onDragStop}
    //       onResizeStop={onResizeStop}
    //     >
    //       <LocalizationProvider dateAdapter={AdapterMoment}>
    //             <TimePicker
    //                 value={query["start"]}
    //                 onChange={(newValue) => setQuery({...query, 'start': newValue})}
    //                 renderInput={({inputRef, inputProps, InputProps }) => {
    //                   return (
    //                         <div>{InputProps?.endAdornment}</div>
    //                     );
    //                 }}
    //             />
    //       </LocalizationProvider>
    //       <LocalizationProvider dateAdapter={AdapterMoment}>
    //         <TimePicker
    //             value={query["end"]}
    //             onChange={(newValue) => setQuery({...query, 'end': newValue})}
    //             renderInput={({inputRef, inputProps, InputProps }) => {
    //                 return (
    //                     <div>{InputProps?.endAdornment}</div>
    //                 );
    //             }}
    //         />
    //       </LocalizationProvider>
    //       <div style={{width: '100%', textAlign: 'center'}}>
    //           <input 
    //             style={{width: '50px'}} 
    //             value={query["location"]}
    //             onChange={(e) => setQuery(
    //               {...query, "location": e.target.value}
    //             )}/>
    //           <input 
    //             style={{width: '30px', marginLeft: '10px'}}
    //             value={query["spatialRange"]}
    //             onChange={(e) => setQuery(
    //               {...query, "spatialRange": e.target.value}
    //             )}/>
    //       </div>
    //     </Rnd>
    //   );

    return (
      <Rnd
        className="stayQuery"
        size={{ width: state.width, height: state.height }}
        position={{ x: state.x, y: state.y }}
        bounds="parent"
        minHeight={minHeight}
        minWidth={minWidth}
        dragAxis="x"
        onDragStop={onDragStop}
        onResizeStop={onResizeStop}
      >
        <div style={{width: '100%', height: '100%'}}>
          <input style={inputStyle} onChange={(e) => setQuery(
              {...query, "location": e.target.value}
          )}/>
          <div style={footerElementsStyle}>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <TimePicker
                    value={query["start"]}
                    onChange={(newValue) => setQuery({...query, 'start': newValue.format("HH:mm")})}
                    renderInput={({inputRef, inputProps, InputProps }) => {
                      return (
                            <Box sx={{ display: 'flex', alignItems: 'center', display: "inline-flex"}}>
                                {InputProps?.endAdornment}
                                <span ref={inputRef}>{query.start}</span>
                            </Box>
                        );
                    }}
                />
            </LocalizationProvider>
            <input
              id="duration"
              type="text"
              style={{border: "none", backgroundColor: "transparent", resize: "none", outline: "none", width: "35%", textAlign: "center"}}
              value={query["duration"]}
                  onChange={(e) => setQuery(
                      {...query, "duration": e.target.value}
              )}
            />
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <TimePicker
                    value={query["end"]}
                    onChange={(newValue) => setQuery({...query, 'end': newValue.format("HH:mm")})}
                    renderInput={({inputRef, inputProps, InputProps }) => {
                        return (
                            <Box sx={{ display: 'flex', alignItems: 'center', display: "inline-flex"}}>
                                {InputProps?.endAdornment}
                                <span ref={inputRef}>{query.end}</span>
                            </Box>
                        );
                    }}
                />
            </LocalizationProvider>
          </div>
        </div>
      </Rnd>
    );
};

const mapStateToProps = (state) => { return {}; }

export default connect(mapStateToProps)(QueryStay);