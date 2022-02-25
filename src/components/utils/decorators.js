import React from 'react';
import { Entity } from 'draft-js';

import {
  highlightSegment,
  dehighlightSegment,
  highlightPoint,
  dehighlightPoint
} from '../../actions/ui';

const STYLES = {
  'Time': { color: '#268bd2', backgroundColor: '#eef6fc', padding: '1px 2px 1px 2px', borderRadius: '4px', fontWeight: 'bold' },
  'Comment': { color: 'rgba(128, 128, 128, 0.4)', fontWeight: 'bold' }
}

const TimeSpan = (props) => {
  const { dispatch, references } = Entity.get(props.entityKey).getData();
  const segmentsToHighlight = references ? [references.from, references.to, references.segmentId].filter((x) => x).map((x) => x.segmentId) : [];
  const onMouseEnter = () => {
    if (references) {
      const refs = references.point || references.to || references.from;
      if (refs) {
        dispatch(highlightPoint([refs.point || refs]));
        dispatch(highlightSegment(segmentsToHighlight));
      }
    }
  }
  const onMouseLeave = () => {
    if (references) {
      const refs = references.point || references.to || references.from;
      if (refs) {
        dispatch(dehighlightPoint([refs.point || refs]));
        dispatch(dehighlightSegment(segmentsToHighlight));
      }
    }
  }

  return (
    <span
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
      className='clickable'
      style={STYLES['Time']}
    >{props.children}</span>
  );
}

const CommentComp = (props) => {
  return (
    <span
      style={STYLES['Comment']}
    >{props.children}</span>
  );
}

const getEntityStrategy = (type) => {
  return (contentBlock, callback) => {
    contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity()
        if (entityKey === null) {
          return false;
        }
        return Entity.get(entityKey).getType() === type;
      },
      callback
    );
  }
}

export default [
  {
    strategy: getEntityStrategy('Time'),
    component: TimeSpan
  },
  {
    strategy: getEntityStrategy('LocationFrom'),
    component: TimeSpan
  },
  {
    strategy: getEntityStrategy('LocationTo'),
    component: TimeSpan
  },
  {
    strategy: getEntityStrategy('Location'),
    component: TimeSpan
  },
  {
    strategy: getEntityStrategy('Tag'),
    component: TimeSpan
  },
  {
    strategy: getEntityStrategy('Semantic'),
    component: TimeSpan
  },
  {
    strategy: getEntityStrategy('Day'),
    component: TimeSpan
  }
];