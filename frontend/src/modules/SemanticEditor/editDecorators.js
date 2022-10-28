import React from 'react';
import { Set } from 'immutable';

import {
  highlightSegment,
  dehighlightSegment,
  highlightPoint,
  dehighlightPoint
} from '../../actions/map';
import { SEMANTIC_STYLES } from '../../constants';

const extractReferences = (references) => {
  let points = []
  let segments = []
  references = references || {}
  if (references.point) {
    points = [references.point]
    segments = [references.segmentId]
  } else {
    const { from, to } = references
    if (from) {
      points.push(from.point)
      segments.push(from.segmentId)
    }
    if (to) {
      points.push(to.point)
      segments.push(to.segmentId)
    }
  }

  return {
    points,
    segments: Set(segments).toJS()
  }
}

const Reference = (props) => {
  const contentState = props.contentState;
  const { dispatch, references } = contentState.getEntity(props.entityKey).getData();
  const { segments, points } = extractReferences(references);
  const onMouseEnter = () => {
    if (segments.length > 0) {
      dispatch(highlightSegment(segments));
    }
    if (points.length > 0) {
      dispatch(highlightPoint(points));
    }
  }
  const onMouseLeave = () => {
    if (segments.length > 0) {
      dispatch(dehighlightSegment(segments));
    }
    if (points.length > 0) {
      dispatch(dehighlightPoint(points));
    }
  }

  const type = contentState.getEntity(props.entityKey).getType();
  const typeStyles = SEMANTIC_STYLES[type] ? SEMANTIC_STYLES[type] : {};
  const style = { ...SEMANTIC_STYLES._, ...typeStyles };

  return (
    <a onMouseLeave={onMouseLeave} onMouseEnter={onMouseEnter} style={style}>{props.children}</a>
  );
}

const TokenSpan = (props) => {
  const contentState = props.contentState;
  const type = contentState.getEntity(props.entityKey).getType();
  const typeStyles = SEMANTIC_STYLES[type] ? SEMANTIC_STYLES[type] : {};
  const style = { ...SEMANTIC_STYLES._, ...typeStyles };
  return (
    <span style={style}>{props.children}</span>
  );
}

const TimeSpan = (props) => {
  const contentState = props.contentState;

  const type = contentState.getEntity(props.entityKey).getType();
  const typeStyles = SEMANTIC_STYLES[type] ? SEMANTIC_STYLES[type] : {};
  const style = { ...SEMANTIC_STYLES._, ...typeStyles };

  const { dispatch, references } = contentState.getEntity(props.entityKey).getData();
  const { segments, points } = extractReferences(references);

  const onMouseEnter = () => {
    if (segments.length > 0) {
      dispatch(highlightSegment(segments));
    }
    if (points.length > 0) {
      dispatch(highlightPoint(points));
    }
  }
  const onMouseLeave = () => {
    if (segments.length > 0) {
      dispatch(dehighlightSegment(segments));
    }
    if (points.length > 0) {
      dispatch(dehighlightPoint(points));
    }
  }

  return (
    <span onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} style={style}>{props.children}</span>
  );
}

const getEntityStrategy = (type) => {
  return (contentBlock, callback, contentState) => {
    contentBlock.findEntityRanges(
      (character) => {
        const entityKey = character.getEntity()
        if (entityKey === null) {
          return false;
        }
        return contentState.getEntity(entityKey).getType() === type;
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
    component: TokenSpan
  },
  {
    strategy: getEntityStrategy('Comment'),
    component: TokenSpan
  },
  {
    strategy: getEntityStrategy('Timezone'),
    component: TokenSpan
  }
];