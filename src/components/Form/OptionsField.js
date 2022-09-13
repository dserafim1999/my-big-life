import React from 'react';

import PropTypes from 'prop-types';

import { MenuItem, TextField } from '@mui/material';

/**
 * Select Input Field for Form
 * 
 * @constructor
 * @param {string} title Input Field name
 * @param {Array} options Dictionary with option key and values
 * @param {any} defaultValue Default key/value pair
 * @param {string | object} help Help text
 * @param {function} onChange Behaviour when value changes
 */
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

OptionsField.propTypes = {
  /** Input Field name */
  title: PropTypes.string,
  /** Dictionary with option key and values */
  options: PropTypes.array,
  /** Default key/value pair */
  defaultValue: PropTypes.any,
  /** Help text */
  help: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  /** Behaviour when value changes */
  onChange: PropTypes.func
}

export default OptionsField;