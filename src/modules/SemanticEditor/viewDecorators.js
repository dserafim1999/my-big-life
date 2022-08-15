import React from 'react';

const SOLARIZED = {
  YELLOW: '#b58900',
  ORANGE: '#d4683b',
  RED: '#dc322f',
  MAGENTA: '#dc322f',
  VIOLET: '#54589c',
  BLUE: '#4d8cb8',
  CYAN: '#71a8ad',
  GREEN: '#4a9945',
  L15: '#002b36',
  L20: '#073642',
  L45: '#586e75',
  L50: '#657b83',
  L60: '#839496',
  L65: '#93a1a1',
  L92: '#eee8d5',
  L97: '#fdf6e3'
}


const STYLES = {
  '_': {
    color: '#268bd2',
    backgroundColor: '#ebebeb',
    padding: '1px 2px 1px 2px',
    borderRadius: '4px',
    fontWeight: 'bold',
    borderBottom: '1px solid #f0f1f2'
  },
  'Time': {
    color: SOLARIZED.GREEN
  },
  'Comment': {
    color: 'rgba(128, 128, 128, 0.4)',
    border: 0
  },
  'LocationFrom': {
    color: SOLARIZED.CYAN
  },
  'Location': {
    color: SOLARIZED.BLUE
  },
  'Timezone': {
    color: SOLARIZED.L65
  },
  'Day': {
    color: SOLARIZED.L50
  },
  'Tag': {
    color: SOLARIZED.YELLOW
  },
  'Semantic': {
    color: SOLARIZED.YELLOW
  }
}


const Reference = (props) => {
  const contentState = props.contentState;
  const type = contentState.getEntity(props.entityKey).getType();
  const typeStyles = STYLES[type] ? STYLES[type] : {};
  const style = { ...STYLES._, ...typeStyles };

  return (
    <a style={style}>{props.children}</a>
  );
}

const TokenSpan = (props) => {
  const contentState = props.contentState;
  const type = contentState.getEntity(props.entityKey).getType();
  const typeStyles = STYLES[type] ? STYLES[type] : {};
  const style = { ...STYLES._, ...typeStyles };
  return (
    <span style={style}>{props.children}</span>
  );
}

const TimeSpan = (props) => {
  const contentState = props.contentState;
  const type = contentState.getEntity(props.entityKey).getType();
  const typeStyles = STYLES[type] ? STYLES[type] : {};
  const style = { ...STYLES._, ...typeStyles };

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