import React from 'react';

import PropTypes from 'prop-types';
import OptionsField from './OptionsField';

/**
 * Options Field for Forms reserved for boolean values
 * 
 * @constructor
 * @param {string} title Input Field name
 * @param {boolean} checked 
 * @param {function} onChange Behaviour when value changes
 */
const ToggleField = ({ title, help, checked, onChange }) => {
    return (
      <OptionsField title={title} help={help} options={[{label: 'Yes', key: true}, {label: 'No', key: false}]} defaultValue={String(checked)} type='boolean' onChange={onChange}/>
    );
}

ToggleField.propTypes = {
  /** Input Field name */
  title: PropTypes.string,
  /** Default value */
  checked: PropTypes.bool,
  /** Behaviour when value changes */
  onChange: PropTypes.func
}

export default ToggleField;