import React from 'react';
import { SEMANTIC_STYLES } from '../../constants';

const Reference = (props) => {
  const contentState = props.contentState;
  const type = contentState.getEntity(props.entityKey).getType();
  const typeStyles = SEMANTIC_STYLES[type] ? SEMANTIC_STYLES[type] : {};
  const style = { ...SEMANTIC_STYLES._, ...typeStyles };

  return (
    <a style={style}>{props.children}</a>
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

  return (
    <span style={style}>{props.children}</span>
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