export const ADD_TRACK = 'tracks/add';
export const REMOVE_TRACK = 'tracks/remove';
export const TOGGLE_TRACK_INFO = 'tracks/toggle_info';
export const ADD_MULTIPLE_TRACKS = 'tracks/add_multiple';
export const UPDATE_TRACK_NAME = 'tracks/update_name';
export const TOGGLE_TRACK_RENAMING = 'tracks/toggle_renaming';
export const UPDATE_TRACK_LIFE = 'tracks/update_LIFE';
export const DISPLAY_TRIPS = 'tracks/display_trips';
export const DISPLAY_CANONICAL_TRIPS = 'tracks/display_canonical_trips';
export const RESET_HISTORY = 'tracks/reset_history';
export const REMOVE_TRACKS_FOR = 'tracks/remove_track_for';
export const UNDO = 'tracks/undo';
export const REDO = 'tracks/redo';
export const DISPLAY_LOCATIONS = 'tracks/display_locations';
export const CLEAR_ALL = 'tracks/clear_all';
export const CLEAR_TRIPS = 'tracks/clear_trips';
export const CLEAR_LOCATIONS = 'tracks/clear_locations';

export const TOGGLE_SEGMENT_VISIBILITY = 'segments/toggle_visibility';
export const TOGGLE_SEGMENT_EDITING = 'segments/toggle_edit';
export const TOGGLE_SEGMENT_SPLITTING = 'segments/toggle_split';
export const TOGGLE_SEGMENT_JOINING = 'segments/toggle_join';
export const TOGGLE_SEGMENT_POINT_DETAILS = 'segments/toggle_point_details';
export const TOGGLE_SEGMENT_INFO = 'segments/toggle_info';
export const TOGGLE_TIME_FILTER = 'segments/toggle_time_filter';
export const CHANGE_SEGMENT_POINT = 'segments/change_point';
export const REMOVE_SEGMENT_POINT = 'segments/remove_point';
export const EXTEND_SEGMENT_POINT = 'segments/extend_point';
export const ADD_SEGMENT_POINT = 'segments/add_point';
export const ADD_NEW_SEGMENT = 'segments/new';
export const EXTEND_SEGMENT = 'segments/extend';
export const REMOVE_SEGMENT = 'segments/remove';
export const SPLIT_SEGMENT = 'segments/split';
export const JOIN_SEGMENT = 'segments/join';
export const ADD_POSSIBILITIES = 'segments/add_possibilities';
export const FIT_SEGMENT = 'segments/fit';
export const UPDATE_TIME_FILTER_SEGMENT = 'segments/time_filter';
export const UPDATE_LOCATION_NAME = 'segments/update_location_name';
export const UPDATE_ACTIVE_LIFE = 'segments/update_active_LIFE';
export const SELECT_POINT_IN_MAP = 'segments/select_point_in_map';
export const DESELECT_POINT_IN_MAP = 'segments/deselect_point_in_map';
export const SELECT_POINT = 'segments/select_point';
export const DESELECT_POINT = 'segments/deselect_point';
export const UPDATE_POINT = 'segments/update_point';
export const STRAIGHT_SELECTED = 'segments/straight_selected';
export const INTERPOLATED_TIME_SELECTED = 'segments/interpolated_time_selected';

export const ADD_ALERT = 'general/add_alert';
export const REMOVE_ALERT = 'general/remove_alert';
export const SET_LOADING = 'general/set_loading';
export const SET_APP_LOADING = 'general/set_app_loading';
export const UPDATE_CONFIG = 'general/update_config';
export const UPDATE_SERVER = 'general/update_server';
export const UPDATE_VIEW = 'general/update_view';
export const UPDATE_LIFE = 'general/update_LIFE';
export const TOGGLE_UI = 'general/toggle_ui';

export const UPDATE_BOUNDS = 'map/bounds';
export const CENTER_MAP = 'map/center';
export const HIGHLIGHT_SEGMENT = 'map/highlight_segment';
export const DEHIGHLIGHT_SEGMENT = 'map/dehighlight_segment';
export const HIGHLIGHT_POINT = 'map/highlight_point';
export const DEHIGHLIGHT_POINT = 'map/dehighlight_point';
export const ADD_POINT_PROMPT = 'map/add_point_prompt';
export const REMOVE_POINT_PROMPT = 'map/remove_point_prompt';

export const ADVANCE_TO_ADJUST = 'process/advance_adjust';
export const ADVANCE_TO_ANNOTATE = 'process/advance_annotate';
export const SET_SERVER_STATE = 'process/set_server_state';
export const TOGGLE_REMAINING_TRACKS = 'process/toggle_remaining_tracks';
export const SET_LIFE = 'process/set_LIFE';
export const SET_BULK_PROGRESS = 'process/set_bulk_progress';
export const SET_IS_BULK_PROCESSING = 'process/set_is_bulk_processing';

export const UPDATE_QUERY_BLOCK = 'queries/update_query_block';
export const ADD_QUERY_STAY = 'queries/add_query_stay';
export const ADD_QUERY_STAY_AND_ROUTE = 'queries/add_query_stay_and_route';
export const REMOVE_QUERY_STAY = 'queries/remove_query_stay';
export const RESET_QUERY = 'queries/reset_query';
export const QUERY_RESULTS = 'queries/query_results';
