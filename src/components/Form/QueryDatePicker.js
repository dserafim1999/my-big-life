import { createTheme, IconButton, InputAdornment, TextField, ThemeProvider } from "@mui/material";
import { Box } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import React from "react";
import moment from 'moment';
import DateIcon from '@mui/icons-material/DateRange';
import SimpleButton from "../Buttons/SimpleButton";

const boxStyle = {
    alignItems: "center", 
    display: "block", 
    cursor: "pointer",
    position: "relative",
    top: "50%",
    transform: "translateY(-50%)",
    marginRight: "15px",
    width: '85px'
}

const QueryDatePicker = ({value, open, onChange, onClose, onClick, title, help, visual=false}) => {
    const calendarIcon = (
        <SimpleButton title='Select Date' tooltipPlacement="top" style={{border: 'none'}}>
            <IconButton>
                <DateIcon></DateIcon>
            </IconButton>
        </SimpleButton>
    );

    const valueRepresentation = () => {
        return value === "--/--/----" || value === null ? (visual ? calendarIcon : "--/--/----") : value;
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

    const DatePickerRenderer = () => {
        if (visual) {
            return (
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
            );
        } else {
            return (
                <DatePicker
                    value={valueFormat()}
                    open={open}
                    showToolbar={true}
                    ToolbarComponent={(props) => Toolbar}
                    onChange={(value) => onChange(dateFormat(value))}
                    onClose={() => onClose(false)}
                    renderInput={ ({inputRef}) => 
                        <TextField 
                            value={valueRepresentation()}
                            label={title}
                            variant='filled'
                            helperText={help}
                            fullWidth
                            style={{paddingBottom: '20px'}}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment onClick={onClick} position="end">
                                        <DateIcon style={{cursor: 'pointer'}}/>
                                    </InputAdornment>
                                )
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
            { DatePickerRenderer() }
        </ThemeProvider>
    );
};



export default QueryDatePicker;
