import { Box } from "@mui/system";
import { TimePicker } from "@mui/x-date-pickers";
import React, { useState } from "react";


const CustomTimePicker = ({value, onChange}) => {
    const [open, setIsOpen] = useState(false);
    
    const valueRepresentation = () => {
        return value === "" ? "--:--" : value;
    }

    const valueFormat = () => {
        return value === "" ? null : value;
    }

    const dateFormat = (newValue) => {
        return newValue === "" || newValue === null  ? "" : newValue.format("HH:mm");
    }

    return (
        <>
            <TimePicker
                value={valueFormat()}
                open={open}
                showToolbar={true}
                onChange={(value) => onChange(dateFormat(value))}
                onClose={() => setIsOpen(false)}
                renderInput={({inputRef}) => {
                return (
                        <Box onClick={() => setIsOpen(true)} sx={{ display: 'flex', alignItems: 'center', display: "inline-flex", cursor: "text"}}>
                            <span ref={inputRef}>{valueRepresentation()}</span>
                        </Box>
                    );
                }}
            />
        </>
    );
};



export default CustomTimePicker;
