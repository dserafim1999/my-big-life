import React from 'react';
import { TextField as TextInput } from '@mui/material';

const TextField = ({ title, placeholder, type, defaultValue, help, onChange, ...details }) => {
  const getValue = (value) => {
    switch (type) {
      case 'number': return parseFloat(value);
      case 'boolean': return value === 'true';
      default: return value;
    }
  }

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
      />
    </span>
  );
}

export default TextField;