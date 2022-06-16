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
