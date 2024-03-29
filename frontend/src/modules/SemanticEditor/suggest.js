import findSuggestionBoxPosition from './findSuggestionBoxPosition';

const removeDuplicates = (arr) => (
  arr.filter((loc, i, arr) => {
    if (i === 0) {
      return true;
    } else {
      const prev = arr[i - 1];
      return prev !== loc;
    }
  })
)

const findLocationsInAst = (ast, value) => {
  let locations = [];
  if (ast && ast.blocks) {
    for (let block of ast.blocks) {
      if (block.location) {
        locations.push(block.location.value);
      }
      if (block.locationFrom) {
        locations.push(block.locationFrom.value);
      }
      if (block.locationTo) {
        locations.push(block.locationTo.value);
      }
    }
  }
  
  const c = removeDuplicates(locations);

  const a = c.filter((loc, i, arr) => {
    if (loc === value) {
      return false;
    }
    if (i === 0 && arr.length > 1) {
      return arr[i + 1] === value;
    }
    if (i > 0 && i < arr.length - 2) {
      return arr[i - 1] === value || arr[i + 1] === value;
    }
    if (i < arr.length - 1) {
      return arr[i - 1] === value;
    }
    return false;
  });
  
  return removeDuplicates(a);
}


export default (editorState, getter, stateSetter, ref, tsuggestions, previousAst) => {
  const sel = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  const startKey = sel.getStartKey();
  const index = sel.getStartOffset();
  let content = editorState.getCurrentContent();
  const block = content.getBlockForKey(startKey);
  const shouldShow = sel.getHasFocus();

  let entityKey = block.getEntityAt(index);

  if (entityKey === null && index > 0) {
    entityKey = block.getEntityAt(index - 1);
  }
  if (entityKey !== null && contentState.getEntity(entityKey)) {
    const entity = contentState.getEntity(entityKey);
    const type = entity.getType();
    const { value } = entity.getData();

    const suggestionGetter = getter[type];

    if (suggestionGetter) {
      const { getter, setter, disposer } = suggestionGetter;

      tsuggestions.show = false;
      stateSetter(tsuggestions);

      const clocs = findLocationsInAst(previousAst, value);

      getter(value, entity.getData(), (suggestions) => {
        // const show = hide ? false : (suggestions.length > 0) && shouldShow
        suggestions.unshift(...clocs, value);
        suggestions = removeDuplicates(suggestions.filter((loc) => loc !== value));
        
        const show = (suggestions.length > 0) && shouldShow;
        
        let ranges = [];
        block.findEntityRanges((c) => c.getEntity() === entityKey, (begin, end) => ranges.push({ begin, end }));
        const { begin, end } = ranges[0];

        const _suggestions = {
          show,
          disposer,
          list: suggestions,
          selected: -1,
          box: findSuggestionBoxPosition(ref, tsuggestions.box),
          setter,
          data: entity.getData(),
          details: { begin, end, key: startKey },
          entityType: type
        };

        stateSetter(_suggestions);
      });
    }
  }
}