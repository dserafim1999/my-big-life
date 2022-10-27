import React, { useEffect } from 'react';

import Card from '../../components/Card';
import { connect } from 'react-redux';
import { actionExample } from '../../actions/example';

/**
 * Example of a module component
 */
const ExampleModule = ({ dispatch, isVisible }) => {
  if (!isVisible) return null; // this allows the Toggle UI button to work

  useEffect( () => {
    // a useEffect with no dependency runs the inner code when a component is created, useful for loading data on startup
    dispatch(actionExample(1,2)); // example of how to dispatch an action to the store
  }, []);

  return (
    <Card width={400} title='Example' verticalOffset={1} horizontalOffset={1}>
        <h1>Hello World!</h1>
    </Card>
  );
}

const mapStateToProps = (state) => { // links data from the global state to a component prop
  return {
    isVisible: state.get('general').get('isUIVisible')
  };
}

export default connect(mapStateToProps)(ExampleModule);

