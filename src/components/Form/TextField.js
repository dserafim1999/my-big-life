import React from 'react';
import { InputAdornment, TextField as TextInput } from '@mui/material';

const TextField = ({ title, placeholder, type, defaultValue, help, onChange, suffix=null, ...details }) => {
  return (
    <span key={title}>
      <TextInput {...details}
        label={title}
        variant='filled' 
        type={type || 'text'}
        defaultValue={defaultValue} 
        placeholder={placeholder} 
        onChange={onChange} 
        helperText={help}
        fullWidth
        style={{paddingBottom: '20px'}}
        {...details}
        InputProps={suffix ? {
            endAdornment: <InputAdornment position="end">{suffix}</InputAdornment>,
          } : {}
        }
      />
    </span>
  );
}

export default TextField;