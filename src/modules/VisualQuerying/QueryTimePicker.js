import { createTheme, ThemeProvider } from "@mui/material";
import { Box } from "@mui/system";
import { TimePicker } from "@mui/x-date-pickers";
import React, { useState } from "react";


const QueryTimePicker = ({value, open, onChange, onClose, onClick}) => {
    const [operator, setOperator] = useState("");
    
    const valueRepresentation = () => {
        return value === "" ? "--:--" : value;
    }

    const valueFormat = () => {
        return value === "" ? null : value.length === 5 ? 
            value :
            value.substring(1); // removes operator
    }

    const dateFormat = (newValue) => {
        return newValue === "" || newValue === null  ? "" : operator + newValue.format("HH:mm");
    }

    const onOperatorClick = (e, operator) => {
        e.preventDefault();
        setOperator(operator);
    }

    const getButtonStyle = (op) => {
        return op === operator ? {backgroundColor: "#284760", color: "white"} : {}
    }

    const onClear = () => {
        onClose(true);
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

    return (
        <ThemeProvider theme={theme}>
            <TimePicker
                value={valueFormat()}
                open={open}
                showToolbar={true}
                ToolbarComponent={(props) => Toolbar}
                onChange={(value) => onChange(dateFormat(value))}
                onClose={() => onClose(false)}
                renderInput={({inputRef}) => {
                return (
                        <Box onClick={onClick} sx={{ display: 'flex', alignItems: 'center', display: "inline-flex", cursor: "text"}}>
                            <span ref={inputRef}>{valueRepresentation()}</span>
                        </Box>
                    );
                }}
            />
        </ThemeProvider>
    );
};



export default QueryTimePicker;
