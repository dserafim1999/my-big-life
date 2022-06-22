import { createTheme, InputAdornment, Popover, TextField, ThemeProvider, Typography } from "@mui/material";
import React, { useRef, useState } from "react";


const QueryNumberPicker = ({value, onChange, label, placeholder, suffix, showOperators, style}) => {
    const [open, setIsOpen] = useState(false);
    const [operator, setOperator] = useState("");
    const [valueState, setValueState] = useState(0);
    const ref = useRef(null);
    
    const boxStyle = {
        alignItems: "center", 
        cursor: "text",
        color: value === "" ? "grey" : "black",
        ...style
    }

    const valueRepresentation = () => {
        return value === "" || value === operator ? placeholder : value;
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
            <button className="button" style={getButtonStyle("<")} onClick={(e) => onOperatorClick(e, "<")}>{"<"}</button>
            <button className="button" style={getButtonStyle("≤")} onClick={(e) => onOperatorClick(e, "≤")}>{"≤"}</button>
            <button className="button" style={getButtonStyle("" )} onClick={(e) => onOperatorClick(e, "" ) }>{"="}</button>
            <button className="button" style={getButtonStyle("≥")} onClick={(e) => onOperatorClick(e, "≥")}>{"≥"}</button>
            <button className="button" style={getButtonStyle(">")} onClick={(e) => onOperatorClick(e, ">")}>{">"}</button>
        </div>
    );

    const onClose = () => {
        setIsOpen(false);
    }

    const onValueChange = (e) => {
        setValueState(e.target.value);
        e.preventDefault();
        onChange(operator + e.target.value + suffix);
    }

    const numberPickerRenderer = () => {
        return (
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
                    type="number"
                    onChange={onValueChange}
                    fullWidth
                    InputProps={{
                        endAdornment: <InputAdornment position="end">{suffix}</InputAdornment>,
                    }}
                />
                { showOperators && Toolbar }
            </Popover>
        </>
        );
        
    }

    return (
        <ThemeProvider theme={theme}>
            { numberPickerRenderer() }
        </ThemeProvider>
    );
};



export default QueryNumberPicker;
