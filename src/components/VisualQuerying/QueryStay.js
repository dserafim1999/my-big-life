import { Box } from "@mui/system";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";


const QueryStay = ({id, startX, maxWidth, maxHeight, width, onChange}) => {
    const height = 50;
    const minWidth = 100;
    const minHeight = 50;
    

    const [state, setState] = useState({
        width: width,
        height: height,
        x: startX,
        y: (maxHeight - height) / 2
    });

    const [query, setQuery] = useState({
      location: 'local',
      spatialRange: '0m',
      start: '--:--',
      end: '--:--',
      duration: "duration",
      temporalEndRange: "0min",
      temporalStartRange: "0min"
    });

    useEffect(() => {
        onChange(id, query)
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
          <LocalizationProvider dateAdapter={AdapterMoment}>
                <TimePicker
                    value={query["start"]}
                    onChange={(newValue) => setQuery({...query, 'start': newValue})}
                    renderInput={({inputRef, inputProps, InputProps }) => {
                      return (
                            <div>{InputProps?.endAdornment}</div>
                        );
                    }}
                />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <TimePicker
                value={query["end"]}
                onChange={(newValue) => setQuery({...query, 'end': newValue})}
                renderInput={({inputRef, inputProps, InputProps }) => {
                    return (
                        <div>{InputProps?.endAdornment}</div>
                    );
                }}
            />
          </LocalizationProvider>
          <div style={{width: '100%', textAlign: 'center'}}>
              <input 
                style={{width: '50px'}} 
                value={query["location"]}
                onChange={(e) => setQuery(
                  {...query, "location": e.target.value}
                )}/>
              <input 
                style={{width: '30px', marginLeft: '10px'}}
                value={query["spatialRange"]}
                onChange={(e) => setQuery(
                  {...query, "spatialRange": e.target.value}
                )}/>
          </div>
        </Rnd>
      );
};

export default QueryStay;