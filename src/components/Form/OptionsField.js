import { FormControl, FormHelperText, MenuItem, Select, TextField } from '@mui/material';
import React from 'react';

const OptionsField = ({title, options, defaultValue, help, onChange}) => {
  return (
    <span key={title}>
        <TextField
          label={title}
          defaultValue={defaultValue}
          onChange={onChange}
          variant='filled'
          helperText={help}
          fullWidth
          select
          style={{paddingBottom: '20px'}}
        >
          { options.map((option) => (<MenuItem key={option.key} value={option.key}>{option.label}</MenuItem>)) }
        </TextField>
    </span>
  );
}

export default OptionsField;