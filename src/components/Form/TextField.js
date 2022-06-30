import React, { useState } from 'react';
import { InputAdornment, MenuItem, TextField as TextInput } from '@mui/material';

const TextField = ({ title, placeholder, type, defaultValue, help, onChange, hasOperators=false, suffix=null, min,...details }) => {
  const [value, setValue] = useState(defaultValue);
  const [operator, setOperator] = useState('');

  const operators = [
    {
      value: '<',
      label: '<',
    },
    {
      value: '≤',
      label: '≤',
    },
    {
      value: '',
      label: '=',
    },
    {
      value: '≥',
      label: '≥',
    },
    {
      value: '>',
      label: '>',
    },
  ];

  const onValueChange = (e) => {
    var newValue;
    if (type === 'number') {
      newValue = e.target.value < min ? min : e.target.value;
    } else {
      newValue = e.target.value;
    }
    
    setValue(newValue);
    onChange(operator + newValue);
  }

  const onOperatorChange = (e) => {
    setOperator(e.target.value);
    onChange(e.target.value + value);
  }

  return (
    <span key={title} style={{display: 'flex', width: '100%'}}>
      { 
        hasOperators && (
          <TextInput
              select
              variant='filled' 
              value={operator}
              onChange={(e) => onOperatorChange(e)}
              style={{width: '20%', marginRight: '5px'}}
          >
            {operators.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextInput>
        )
      }
      <TextInput {...details}
        label={title}
        value={value || ''}
        variant='filled' 
        type={type || 'text'}
        defaultValue={defaultValue} 
        placeholder={placeholder} 
        onChange={(e) => onValueChange(e)} 
        helperText={help}
        fullWidth
        select={false}
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