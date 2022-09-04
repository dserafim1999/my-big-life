import React, { useState } from 'react';

import PropTypes from 'prop-types';

import { InputAdornment, MenuItem, TextField as TextInput } from '@mui/material';

/**
 * Text Input Field for Form
 *  
 * @constructor
 * @param {string} title Input Field name
 * @param {string} placeholder Placeholder text
 * @param {string} type Value type
 * @param {string} defaultValue Default value for input value
 * @param {string} help Help text
 * @param {function} onChange Behaviour when value is changed
 * @param {boolean} hasOperators If true, operators can be selected via a Select Menu (<,≤,=,≥,>)
 * @param {string} suffix Input adornment text
 * @param {number} min Minimum numeric value (if type is 'number')
 */
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
      newValue = parseFloat(e.target.value) < min ? min : parseFloat(e.target.value);
    } else {
      newValue = e.target.value;
    }
    
    setValue(newValue);
    onChange(operator === '' ? newValue : operator + newValue);
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

TextField.propTypes = {
  /** Input Field name */
  title: PropTypes.string,
  /** Placeholder text */
  placeholder: PropTypes.string,
  /** Value type */
  type: PropTypes.string,
  /** Default value for input value */
  defaultValue: PropTypes.string,
  /** Help text */
  help: PropTypes.string,
  /** Behaviour when value is changed */
  onChange: PropTypes.func,
  /** If true, operators can be selected via a Select Menu (<,≤,=,≥,>) */
  hasOperators: PropTypes.bool,
  /** Input adornment text */
  suffix: PropTypes.string,
  /** Minimum numeric value (if type is 'number') */
  min: PropTypes.number,
} 

export default TextField;