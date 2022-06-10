import React from 'react';
import OptionsField from './OptionsField';

const ToggleField = ({ title, checked, onChange }) => {
    return (
      <OptionsField title={title} options={[{label: 'Yes', key: true}, {label: 'No', key: false}]} defaultValue={String(checked)} type='boolean' onChange={onChange}/>
    );
}

export default ToggleField;