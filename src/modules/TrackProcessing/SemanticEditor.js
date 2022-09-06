import React from 'react';

import SemanticEditor from '../SemanticEditor';
import PropTypes from 'prop-types';
import ImmutablePropTypes  from 'react-immutable-proptypes';

import decorators from '../SemanticEditor/editDecorators';
import suggestionsGetters from '../SemanticEditor/suggestionsGetters';
import { connect } from 'react-redux';
import { ContentState } from 'draft-js';
import { setLIFE } from '../../actions/process';

/**
 * Container that sets up data regarding processing for the Semantic Editor module
 * 
 * @constructor
 * @param {function} dispatch Redux store action dispatcher
 * @param {ImmutablePropTypes.Map} segments Immutable List containing segment objects.
 * @param {string} life LIFE string
 */
let SE = ({ dispatch, segments, life }) => {
  const state = ContentState.createFromText(life);

  return (
    <SemanticEditor
      state={ state }
      segments={ segments }
      dispatch={ dispatch }
      strategies={ decorators }
      suggestionGetters={ suggestionsGetters }
      onChange={(stateEditor, ast, text) => {
        dispatch(setLIFE(text));
      }}
    >
    </SemanticEditor>
  );
}

const mapStateToProps = (state) => {
  return {
    segments: state.get('tracks').get('segments'),
    life: state.get('process').get('initLIFE') || ''
  };
}
  
SE.propTypes = {
  /** Redux store action dispatcher */
  dispatch: PropTypes.func,
  /** Immutable List containing segment objects */
  segments: ImmutablePropTypes.mapOf(PropTypes.object),
  /** LIFE string */
  life: PropTypes.string
}
SE = connect(mapStateToProps)(SE);

export default SE;