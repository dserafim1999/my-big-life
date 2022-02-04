const ui = (state = {}, action) => {
    switch (action.type) {
      case 'ui/bounds':
        state.bounds = action.bounds;
        return Object.assign({}, state);
      default:
        return state;
    }
}

export default ui;