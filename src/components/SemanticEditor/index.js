import React from 'react';
import { connect } from 'react-redux';
import { ContentState } from 'draft-js';
import SemanticEditor from '../../modules/SemanticEditor';

import decorators from '../../modules/SemanticEditor/decorators';
import suggestionsGetters from '../../modules/SemanticEditor/suggestionsGetters';
import { setTransportationModes } from '../../actions/segments';
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
        const modes = [];
        const isValidTMode = (mode) => {
          return ['foot', 'vehicle', 'train', 'boat', 'airplane']
            .indexOf(mode.toLocaleLowerCase()) !== -1;
        }
        const extractTMFromDetails = (details, references) => {
          return details
            .filter((detail) => {
              if (detail.type === 'Tag') {
                return isValidTMode(detail.value);
              }
              return false;
            })
            .map((detail) => ({
              label: detail.value.toLocaleLowerCase(),
              references
            }));
        }

        ast.blocks
          .filter((block) => block.type === 'Trip')
          .forEach((block) => {
            if (block.tmodes) {
              block.tmodes.forEach((mode) => {
                const { references } = mode;
                modes.push(...extractTMFromDetails(mode.details, references));
              });
            }
            modes.push(...extractTMFromDetails(block.details, block.references));
          })

        const mappedModes = modes.map((mode) => ({
          label: mode.label,
          to: mode.references.to,
          from: mode.references.from
        }));
        dispatch(setTransportationModes(mappedModes));
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