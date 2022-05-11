import React, { useState } from 'react';
import { connect } from 'react-redux';
import { executeQuery } from '../../actions/queries';

import AsyncButton from '../../components/Buttons/AsyncButton';

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { Box } from '@mui/system';

const QueryForm = ({dispatch, isLoading}) =>  {
    const defaultRangeQuery = {
        "location":"local",
        "start":"--:--",
        "end":"--:--",
        "spatialRange":"0m",
        "temporalStartRange":"0min",
        "temporalEndRange":"0min",
        "duration":"duration"
    };

    const defaultIntervalQuery = {
        "route":"",
        "duration":"duration",
        "start":"--:--",
        "end":"--:--",
        "temporalStartRange":"0min",
        "temporalEndRange":"0min"
    };

    const [ range1, setRange1 ] = useState(defaultRangeQuery);
    const [ interval, setInterval ] = useState(defaultIntervalQuery);
    const [ range2, setRange2 ] = useState(defaultRangeQuery);
    const [ fullQuery, setFullQuery ] = useState(false);

    const onSubmit = (e) => {
        range1.start = range1.start !== '--:--' ? range1.start.format("HH:mm") : range1.start; 
        range1.end = range1.end !== '--:--' ? range1.end.format("HH:mm") : range1.end;
        interval.start = interval.start !== '--:--' ? interval.start.format("HH:mm") : interval.start; 
        interval.end = interval.end !== '--:--' ? interval.end.format("HH:mm") : interval.end;
        range2.start = range2.start !== '--:--' ? range2.start.format("HH:mm") : range2.start; 
        range2.end = range2.end !== '--:--' ? range2.end.format("HH:mm") : range2.end;

        console.log(range1)
        
        if (fullQuery) {
            dispatch(executeQuery(
                {
                    "data": [
                        {
                            "date": "--/--/----"
                        },
                        range1,
                        interval,
                        range2
                    ]
                })
            )
        } else {
            dispatch(executeQuery(
                {
                    "data": [
                        {
                            "date": "--/--/----"
                        },
                        range1
                    ]
                })
            )
        }
    }

    const inputStyle = {textAlign: "right", fontSize: "11px"}
    const labelStyle = {float: "left", fontSize: "11px"}
    const footerStyle = {textAlign: "end", paddingTop: "10px"}
    const queryButtonClass = 'is-blue' + (isLoading ? ' is-loading' : '');
    
    return (
        <div>
            <form>
                <h6>Start</h6>
                <div id="range1">
                    <div style={inputStyle}>
                        <label style={labelStyle}>Duration</label>
                        <input
                            id="duration"
                            type="text"
                            value={range1["duration"]}
                             onChange={(e) => setRange1(
                                 {...range1, "duration": e.target.value}
                            )}
                        />
                    </div>
                    <div style={inputStyle}>
                        <label style={labelStyle}>Start Range</label>
                        <input
                            id="startRange"
                            type="text"
                            value={range1["temporalStartRange"]}
                             onChange={(e) => setRange1(
                                 {...range1, "temporalStartRange": e.target.value}
                            )}
                        />
                    </div>
                    <div style={inputStyle}>
                        <label style={labelStyle}>Start</label>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <TimePicker
                                value={range1["start"]}
                                onChange={(newValue) => setRange1({...range1, 'start': newValue})}
                                renderInput={({inputRef, inputProps, InputProps }) => {
                                    return (
                                        <Box sx={{ display: 'flex', alignItems: 'center', display: "inline-flex"}}>
                                            {InputProps?.endAdornment}
                                            <input ref={inputRef} {...inputProps} style={{marginLeft: "5px"}} />
                                        </Box>
                                    );
                                }}
                            />
                        </LocalizationProvider>
                    </div>
                    <div style={inputStyle}>
                        <label style={labelStyle}>End Range</label>
                        <input
                            id="endRange"
                            type="text"
                            value={range1["temporalEndRange"]}
                             onChange={(e) => setRange1(
                                 {...range1, "temporalEndRange": e.target.value}
                            )}
                        />
                    </div>
                    <div style={inputStyle}>
                        <label style={labelStyle}>End</label>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <TimePicker
                                value={range1["end"]}
                                onChange={(newValue) => setRange1({...range1, 'end': newValue})}
                                renderInput={({inputRef, inputProps, InputProps }) => {
                                    return (
                                        <Box sx={{ display: 'flex', alignItems: 'center', display: "inline-flex"}}>
                                            {InputProps?.endAdornment}
                                            <input ref={inputRef} {...inputProps} style={{marginLeft: "5px"}} />
                                        </Box>
                                    );
                                }}
                            />
                        </LocalizationProvider>
                    </div>
                    <div style={inputStyle}>
                        <label style={labelStyle}>Location</label>
                        <input
                            id="location"
                            type="text"
                            value={range1["location"]}
                             onChange={(e) => setRange1(
                                 {...range1, "location": e.target.value}
                            )}
                        />
                    </div>
                    <div style={inputStyle}>
                        <label style={labelStyle}>Spatial Range</label>
                        <input
                            id="spatialRange"
                            type="text"
                            value={range1["spatialRange"]}
                             onChange={(e) => setRange1(
                                 {...range1, "spatialRange": e.target.value}
                            )}
                        />
                    </div>
                </div>
            </form>
            {
                fullQuery ? (
                   <>
                    <hr/>
                    <form>
                        <h6>Route</h6>
                        <div id="interval">
                            <div style={inputStyle}>
                                <label style={labelStyle}>Duration</label>
                                <input
                                    id="duration"
                                    type="text"
                                    value={interval["duration"]}
                                        onChange={(e) => setInterval(
                                            {...interval, "duration": e.target.value}
                                    )}
                                />
                            </div>
                            <div style={inputStyle}>
                                <label style={labelStyle}>Start Range</label>
                                <input
                                    id="startRange"
                                    type="text"
                                    value={interval["temporalStartRange"]}
                                        onChange={(e) => setInterval(
                                            {...interval, "temporalStartRange": e.target.value}
                                    )}
                                />
                            </div>
                            <div style={inputStyle}>
                                <label style={labelStyle}>Start</label>
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <TimePicker
                                        value={interval["start"]}
                                        onChange={(newValue) => setInterval({...interval, 'start': newValue})}
                                        renderInput={({inputRef, inputProps, InputProps }) => {
                                            return (
                                                <Box sx={{ display: 'flex', alignItems: 'center', display: "inline-flex"}}>
                                                    {InputProps?.endAdornment}
                                                    <input ref={inputRef} {...inputProps} style={{marginLeft: "5px"}} />
                                                </Box>
                                            );
                                        }}
                                    />
                                </LocalizationProvider>
                            </div>
                            <div style={inputStyle}>
                                <label style={labelStyle}>End Range</label>
                                <input
                                    id="endRange"
                                    type="text"
                                    value={interval["temporalEndRange"]}
                                        onChange={(e) => setInterval(
                                            {...interval, "temporalEndRange": e.target.value}
                                    )}
                                />
                            </div>
                            <div style={inputStyle}>
                                <label style={labelStyle}>End</label>
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <TimePicker
                                        value={interval["end"]}
                                        onChange={(newValue) => setInterval({...interval, 'end': newValue})}
                                        renderInput={({inputRef, inputProps, InputProps }) => {
                                            return (
                                                <Box sx={{ display: 'flex', alignItems: 'center', display: "inline-flex"}}>
                                                    {InputProps?.endAdornment}
                                                    <input ref={inputRef} {...inputProps} style={{marginLeft: "5px"}} />
                                                </Box>
                                            );
                                        }}
                                    />
                                </LocalizationProvider>
                            </div>
                            <div style={inputStyle}>
                                <label style={labelStyle}>Route</label>
                                <input
                                    id="route"
                                    type="text"
                                    value={range1["route"]}
                                        onChange={(e) => setInterval(
                                            {...interval, "route": e.target.value}
                                    )}
                                />
                            </div>
                        </div>
                    </form>
                    <hr/>
                    <form>
                        <h6>Destination</h6>
                        <div id="range2">
                            <div style={inputStyle}>
                                <label style={labelStyle}>Duration</label>
                                <input
                                    id="duration"
                                    type="text"
                                    value={range2["duration"]}
                                        onChange={(e) => setRange2(
                                            {...range2, "duration": e.target.value}
                                    )}
                                />
                            </div>
                            <div style={inputStyle}>
                                <label style={labelStyle}>Start Range</label>
                                <input
                                    id="startRange"
                                    type="text"
                                    value={range2["temporalStartRange"]}
                                        onChange={(e) => setRange2(
                                            {...range2, "temporalStartRange": e.target.value}
                                    )}
                                />
                            </div>
                            <div style={inputStyle}>
                                <label style={labelStyle}>Start</label>
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <TimePicker
                                        value={range2["start"]}
                                        onChange={(newValue) => setRange2({...range2, 'start': newValue})}
                                        renderInput={({inputRef, inputProps, InputProps }) => {
                                            return (
                                                <Box sx={{ display: 'flex', alignItems: 'center', display: "inline-flex"}}>
                                                    {InputProps?.endAdornment}
                                                    <input ref={inputRef} {...inputProps} style={{marginLeft: "5px"}} />
                                                </Box>
                                            );
                                        }}
                                    />
                                </LocalizationProvider>
                            </div>
                            <div style={inputStyle}>
                                <label style={labelStyle}>End Range</label>
                                <input
                                    id="endRange"
                                    type="text"
                                    value={range2["temporalEndRange"]}
                                        onChange={(e) => setRange2(
                                            {...range2, "temporalEndRange": e.target.value}
                                    )}
                                />
                            </div>
                            <div style={inputStyle}>
                                <label style={labelStyle}>End</label>
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <TimePicker
                                        value={range2["end"]}
                                        onChange={(newValue) => setRange2({...range2, 'end': newValue})}
                                        renderInput={({inputRef, inputProps, InputProps }) => {
                                            return (
                                                <Box sx={{ display: 'flex', alignItems: 'center', display: "inline-flex"}}>
                                                    {InputProps?.endAdornment}
                                                    <input ref={inputRef} {...inputProps} style={{marginLeft: "5px"}} />
                                                </Box>
                                            );
                                        }}
                                    />
                                </LocalizationProvider>
                            </div>
                            <div style={inputStyle}>
                                <label style={labelStyle}>Location</label>
                                <input
                                    id="location"
                                    type="text"
                                    value={range2["location"]}
                                        onChange={(e) => setRange2(
                                            {...range2, "location": e.target.value}
                                    )}
                                />
                            </div>
                            <div style={inputStyle}>
                                <label style={labelStyle}>Spatial Range</label>
                                <input
                                    id="spatialRange"
                                    type="text"
                                    value={range2["spatialRange"]}
                                        onChange={(e) => setRange2(
                                            {...range2, "spatialRange": e.target.value}
                                    )}
                                />
                            </div>
                        </div>
                    </form>
                   </>
                ) : <></>
            }
            <footer style={footerStyle}> 
                <AsyncButton 
                    className={'is-blue'}
                    style={{marginRight: "5px"}}
                    title='Add more Query Parameters'
                    onClick={(e, modifier) => {
                            setFullQuery(!fullQuery)
                        }   
                    } > More 
                </AsyncButton>
                <AsyncButton 
                    className={queryButtonClass}
                    title='Send Query'
                    onClick={(e, modifier) => {
                            modifier('is-loading')
                            onSubmit()
                            modifier()
                        }
                    } > Query 
                </AsyncButton>
            </footer>
        </div> 
    )
}



const mapStateToProps = (state) => {
    return {
        isLoading: state.get('general').get('loading').has('query-button')
    }
  }
  
export default connect(mapStateToProps)(QueryForm);
