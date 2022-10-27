import React, { useState } from "react";

import PropTypes from 'prop-types';
import TimeIcon from "@mui/icons-material/AccessTime";

import { createTheme, InputAdornment, TextField, ThemeProvider } from "@mui/material";
import { Box } from "@mui/system";
import { TimePicker } from "@mui/x-date-pickers";

/**
 * Custom Input Field with Time Picker for Querying
 * 
 * @constructor
 * @param {string} value Current value
 * @param {boolean} open If Date Picker is open
 * @param {function} onChange Behaviour if value is changed
 * @param {function} onClose Behaviour if Time Picker is closed
 * @param {function} onClick Behaviour if Input Field is clicked 
 * @param {string} title Input Field name
 * @param {string} help Help text
 * @param {boolean} visual If not visual, Text Fields are used 
 * @param {object} style Aditional CSS styling 
 */
const QueryTimePicker = ({value, open, onChange, onClose, onClick, visual=false, title, help, style}) => {
    const [operator, setOperator] = useState("");
    const [valueState, setValueState] = useState(value);
    
    const valueRepresentation = () => {
        return value === "" ? "--:--" : value;
    }

    const valueFormat = () => {
        return value === "" ? null : value.length === 5 ? 
            value :
            value.substring(1); // removes operator
    }

    const dateFormat = (newValue, operator) => {
        return newValue === "" || newValue === null  ? "" : operator + newValue.format("HH:mm");
    }

    const onOperatorClick = (e, operator) => {
        e.preventDefault();
        setOperator(operator);
        onChange(dateFormat(valueState, operator));
    }

    const getButtonStyle = (op) => {
        return op === operator ? {backgroundColor: "#284760", color: "white"} : {}
    }

    const onClear = () => {
        setValueState("");
        onClose(true);
    }

    const onValueChange = (newValue) => {
        setValueState(newValue);
        onChange(dateFormat(newValue, operator));
    }

    const Toolbar = (
        <div style={{padding: "15px"}}>
            <button className="button" onClick={onClear}>Clear</button>
            <div style={{padding: "15px 0px", display: "flex", justifyContent: "space-between"}}>
                <button className="button" style={getButtonStyle("<")} onClick={(e) => onOperatorClick(e, "<")}>{"<"}</button>
                <button className="button" style={getButtonStyle("≤")} onClick={(e) => onOperatorClick(e, "≤")}>{"≤"}</button>
                <button className="button" style={getButtonStyle("" )} onClick={(e) => onOperatorClick(e, "" ) }>{"="}</button>
                <button className="button" style={getButtonStyle("≥")} onClick={(e) => onOperatorClick(e, "≥")}>{"≥"}</button>
                <button className="button" style={getButtonStyle(">")} onClick={(e) => onOperatorClick(e, ">")}>{">"}</button>
            </div>
        </div>
    );

    const theme = createTheme({
        palette: {
            primary: {
              main: '#284760',
            },
          },
      });

    const TimePickerRenderer = () => {
        if (visual) {
            return (
                <TimePicker
                    value={valueFormat()}
                    open={open}
                    showToolbar={true}
                    ToolbarComponent={() => Toolbar}
                    onChange={(value) => onValueChange(value)}
                    onClose={() => onClose(false)}
                    renderInput={({inputRef}) => {
                    return (
                            <Box onClick={onClick} sx={{ display: 'flex', alignItems: 'center', display: "inline-flex", cursor: "text"}}>
                                <span ref={inputRef}>{valueRepresentation()}</span>
                            </Box>
                        );
                    }}
                />
            );
        } else {
            return (
                <TimePicker
                    value={valueFormat()}
                    open={open}
                    showToolbar={true}
                    ToolbarComponent={() => Toolbar}
                    onChange={(value) => onValueChange(value)}
                    onClose={() => onClose(false)}
                    renderInput={ ({inputRef}) => 
                        <TextField 
                            value={valueRepresentation()}
                            label={title}
                            variant='filled'
                            helperText={help}
                            fullWidth
                            style={{paddingBottom: '20px', ...style}}
                            InputProps={{
                                endAdornment: <InputAdornment onClick={onClick} position="end"><TimeIcon style={{cursor: 'pointer'}}/></InputAdornment>,
                            }}
                            ref={inputRef}
                        />
                    }
                />
            );
        }
    }

    return (
        <ThemeProvider theme={theme}>
            { TimePickerRenderer() }
        </ThemeProvider>
    );
};

QueryTimePicker.propTypes = {
    /** Current value */
    value: PropTypes.string,
    /** If Date Picker is open */
    open: PropTypes.bool,
    /** Behaviour if value is changed */
    onChange: PropTypes.func,
    /** Behaviour if Date Picker is closed */
    onClose: PropTypes.func,
    /** Behaviour if Input Field is clicked */ 
    onClick: PropTypes.func,
    /** Input Field name */
    title: PropTypes.string,
    /** Help text */
    help: PropTypes.string,
    /** If not visual, Text Fields are used */
    visual: PropTypes.bool,
    /** Aditional CSS styling */
    style: PropTypes.object
}

export default QueryTimePicker;
