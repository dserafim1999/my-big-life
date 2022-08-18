import React from 'react';
import { connect } from 'react-redux';
import { ContentState } from 'draft-js';
import SemanticEditor from '../../modules/SemanticEditor';

import decorators from '../../modules/SemanticEditor/editDecorators';
import suggestionsGetters from '../../modules/SemanticEditor/suggestionsGetters';
import { setLIFE } from '../../actions/process';

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
  
SE = connect(mapStateToProps)(SE);

export default SE;