export const DONE_STAGE = -1;
export const PREVIEW_STAGE = 0;
export const ADJUST_STAGE = 1;
export const ANNOTATE_STAGE = 2;

export const MAIN_VIEW = 0;
export const SEARCH = 1;
export const LIFE_EDITOR = 2;
export const TRACK_PROCESSING = 3;
export const VISUAL_QUERIES = 4;
export const CONFIG_PANEL = 5;

export const MAP_DECORATION_ZOOM_LEVEL = 10;
export const MAP_DETAIL_ZOOM_LEVEL = 14;

export const MAP_STATES = {
  NORMAL: 0,
  EDITING: 1,
  SPLITTING: 2,
  JOINING: 3,
  POINT_DETAILS: 4
};

export const DEFAULT_ROUTE = {
  route: "",
  duration:"",
  start: "",
  end: "",
  temporalStartRange: "",
  temporalEndRange: ""
};

export const DEFAULT_STAY = {
  location: "",
  spatialRange: "",
  start: "",
  end: "",
  duration: "",
  temporalEndRange: "",
  temporalStartRange: ""
};

export const MINUTES_IN_DAY = 24 * 60;

export const SEMANTIC_COLORS = {
  YELLOW: '#b58900',
  ORANGE: '#d4683b',
  RED: '#dc322f',
  MAGENTA: '#a32e2c',
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

export const SEMANTIC_STYLES = {
  '_': {
    color: '#268bd2',
    backgroundColor: '#ebebeb',
    padding: '1px 2px 1px 2px',
    borderRadius: '4px',
    fontWeight: 'bold',
    borderBottom: '1px solid #f0f1f2'
  },
  'Time': {
    color: SEMANTIC_COLORS.GREEN
  },
  'Comment': {
    color: 'rgba(128, 128, 128, 0.4)',
    border: 0
  },
  'LocationFrom': {
    color: SEMANTIC_COLORS.CYAN
  },
  'Location': {
    color: SEMANTIC_COLORS.BLUE
  },
  'Timezone': {
    color: SEMANTIC_COLORS.L65
  },
  'Day': {
    color: SEMANTIC_COLORS.L50
  },
  'Tag': {
    color: SEMANTIC_COLORS.YELLOW
  },
  'Semantic': {
    color: SEMANTIC_COLORS.MAGENTA
  }
}