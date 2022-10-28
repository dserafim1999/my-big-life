import React, { useRef, useState } from "react";

import PropTypes from 'prop-types';

import { createTheme, InputAdornment, Popover, TextField, ThemeProvider } from "@mui/material";

/**
 * Custom number Input Field that limits values and allows to prefix operators, for Querying
 * 
 * @constructor
 * @param {string} value Current value
 * @param {function} onChange Behaviour when value changes
 * @param {function} onClear Behaviour when value is cleared
 * @param {string} label Input Field name
 * @param {string} placeholder Placeholder text
 * @param {string} suffix Input adornment text
 * @param {string} initialOperator Initial operator
 * @param {boolean} showOperators If true, operator select buttons are displayed
 * @param {object} style Aditional CSS styling
 */
const QueryNumberPicker = ({value, onChange, onClear, label, placeholder, suffix="", initialOperator = "", showOperators, style}) => {
    const [open, setIsOpen] = useState(false);
    const [operator, setOperator] = useState(initialOperator);
    const ref = useRef(null);
    const min = 0;

    const isEmptyValue = () => {
        return  value === "" || value === operator;
    } 

    const [valueState, setValueState] = useState(isEmptyValue() ? min : value);

    const boxStyle = {
        alignItems: "center", 
        cursor: "text",
        color: value === "" ? "grey" : "black",
        ...style
    }

    const valueRepresentation = () => {
        return isEmptyValue() ? placeholder : value;
    }

    const theme = createTheme({
        palette: {
            primary: {
              main: '#284760',
            },
          },
    });

    const getButtonStyle = (op) => {
        return op === operator ? {backgroundColor: "#284760", color: "white"} : {}
    }

    const onOperatorClick = (e, operator) => {
        e.preventDefault();
        setOperator(operator);
        onChange(operator + valueState + suffix);
    }

    const Toolbar = (
        <div style={{display: "flex", justifyContent: "space-between"}}>
            { showOperators && (
                <>
                    <button className="button" style={getButtonStyle("<")} onClick={(e) => onOperatorClick(e, "<")}>{"<"}</button>
                    <button className="button" style={getButtonStyle("≤")} onClick={(e) => onOperatorClick(e, "≤")}>{"≤"}</button>
                    <button className="button" style={getButtonStyle("")} onClick={(e) => onOperatorClick(e, "")}>{"="}</button>
                    <button className="button" style={getButtonStyle("≥")} onClick={(e) => onOperatorClick(e, "≥")}>{"≥"}</button>
                    <button className="button" style={getButtonStyle(">")} onClick={(e) => onOperatorClick(e, ">")}>{">"}</button>
                </>
            )}
            <button className="button" style={{width: "100%"}} onClick={() => onValueClear()}>Clear</button>
        </div>
    );

    const onClose = () => {
        setIsOpen(false);
    }

    const onValueClear = () => {
        setOperator(initialOperator);
        setValueState(min);
        onClear();
    }

    const onValueChange = (e) => {
        var newValue = e.target.value < min ? min : e.target.value;
        e.preventDefault();

        setValueState(newValue);
        onChange(operator + newValue + suffix);
    }

    const getNumericValue = () => {
        return value.replace(suffix, '').replace(operator, '');
    } 

    const NumberPickerRenderer = (
        <>
            <span 
                ref={ref} 
                style={boxStyle} 
                onDoubleClick={(e) => e.stopPropagation()} 
                onClick={() => setIsOpen(true)}
            > 
                    {valueRepresentation()} 
            </span>
            
            <Popover
                onDoubleClick={(e) => e.stopPropagation()}
                open={open}
                anchorEl={ref.current}
                onClose={onClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <TextField
                    label={label}
                    variant="filled"
                    value={getNumericValue()} 
                    type="number"
                    onChange={onValueChange}
                    fullWidth
                    InputProps={{
                        endAdornment: <InputAdornment position="end">{suffix}</InputAdornment>,
                    }}
                />
                { Toolbar }
            </Popover>
        </>
        );
    
    return (
        <ThemeProvider theme={theme}>
            { NumberPickerRenderer }
        </ThemeProvider>
    );
};

QueryNumberPicker.propTypes = {
    /** Current value */
    value: PropTypes.string,
    /** Behaviour when value changes */
    onChange: PropTypes.func, 
    /** Behaviour when value is cleared */
    onClear: PropTypes.func,
    /** Input Field name */
    label: PropTypes.string,
    /** Placeholder text */
    placeholder: PropTypes.string,
    /** Input adornment text */
    suffix: PropTypes.string,
    /** Initial operator */
    initialOperator: PropTypes.string,
    /** If true, operator select buttons are displayed */
    showOperators: PropTypes.bool,
    /** Aditional CSS styling */
    style: PropTypes.object,
}

export default QueryNumberPicker;
