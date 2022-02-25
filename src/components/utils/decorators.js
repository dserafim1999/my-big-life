import React from 'react';
import { Entity } from 'draft-js';

import {
  highlightSegment,
  dehighlightSegment,
  highlightPoint,
  dehighlightPoint
} from '../../actions/ui';

const STYLES = {
  '_': {
    color: '#268bd2',
    backgroundColor: '#eef6fc',
    padding: '1px 2px 1px 2px',
    borderRadius: '4px',
    fontWeight: 'bold'
  },
  'Comment': {
    color: 'rgba(128, 128, 128, 0.4)',
    fontWeight: 'bold'
  }
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
      style={STYLES._}
    >{props.children}</span>
  );
}

const extractReferences = (references) => {
  let point, segmentId;
  if (references) {
    if (references.point) {
      point = references.point;
      segmentId = references.segmentId;
    } else if (references.from || references.to) {
      const { from, to } = references;
      if (from) {
        point = from.point;
        segmentId = from.segmentId;
      } else if (to) {
        point = to.point;
        segmentId = to.segmentId;
      }
    }
  }
  return { segmentId, point };
}

const Reference = (props) => {
  const { dispatch, references } = Entity.get(props.entityKey).getData();
  const { segmentId, point } = extractReferences(references);
  const onMouseEnter = () => {
    if (segmentId !== undefined) {
      dispatch(highlightSegment([segmentId]));
    }
    if (point) {
      dispatch(highlightPoint([point]));
    }
  }
  const onMouseLeave = () => {
    if (segmentId !== undefined) {
      dispatch(dehighlightSegment([segmentId]));
    }
    if (point) {
      dispatch(dehighlightPoint([point]));
    }
  }

  return (
    <a onMouseLeave={onMouseLeave} onMouseEnter={onMouseEnter} style={STYLES._} {...props}>{props.children}</a>
  );
}

const CommentComp = (props) => {
  return (
    <span
      style={STYLES['Comment']}
    >{props.children}</span>
  );
}

const Day = (props) => {
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
    component: Reference
  },
  {
    strategy: getEntityStrategy('LocationFrom'),
    component: Reference
  },
  {
    strategy: getEntityStrategy('LocationTo'),
    component: Reference
  },
  {
    strategy: getEntityStrategy('Location'),
    component: Reference
  },
  {
    strategy: getEntityStrategy('Tag'),
    component: Reference
  },
  {
    strategy: getEntityStrategy('Semantic'),
    component: Reference
  },
  {
    strategy: getEntityStrategy('Day'),
    component: Day
  },
  {
    strategy: getEntityStrategy('Comment'),
    component: CommentComp
  }
];