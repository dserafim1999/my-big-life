import { createTheme, ThemeProvider } from "@mui/material";
import { Box } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import React from "react";
import moment from 'moment';


const boxStyle = {
    alignItems: "center", 
    display: "block", 
    cursor: "text",
    position: "relative",
    top: "50%",
    transform: "translateY(-50%)",
    marginRight: "15px"
}

const QueryDatePicker = ({value, open, onChange, onClose, onClick}) => {
    const valueRepresentation = () => {
        return value === null ? "--/--/----" : value;
    }

    const valueFormat = () => {
        return value === "--/--/----" ? null : moment(value, "DD/MM/YYYY");
    }

    const dateFormat = (newValue) => {
        return newValue === "--/--/----" || newValue === null  ? "--/--/----" : newValue.format("DD/MM/YYYY");
    }


    const onClear = () => {
        onClose(true);
    }

    const Toolbar = (
        <div style={{padding: "15px"}}>
            <button className="button" onClick={onClear}>Clear</button>
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
            <DatePicker
                value={valueFormat()}
                open={open}
                showToolbar={true}
                ToolbarComponent={(props) => Toolbar}
                onChange={(value) => onChange(dateFormat(value))}
                onClose={() => onClose(false)}
                renderInput={({inputRef}) => {
                return (
                    <Box onClick={onClick} sx={boxStyle}>
                        <span ref={inputRef}>{valueRepresentation()}</span>
                    </Box>
                    );
                }}
            />
        </ThemeProvider>
    );
};



export default QueryDatePicker;
