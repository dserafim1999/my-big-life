import { EditorState, SelectionState, Modifier, Entity } from 'draft-js';
import buildLifeAst from './buildLifeAst';

const descriptiveStyle = (contentState, styleType, marks, value, content, lineKeys, more = {}) => {
  const { offset, length, line } = marks;

  const start = offset;
  const end = offset + length;

  const _sel = new SelectionState({
    anchorOffset: start,
    anchorKey: lineKeys.get(line),
    focusKey: lineKeys.get(line),
    focusOffset: end,
    isBackward: false,
    hasFocus: false
  });

  const contentStateWithEntity = contentState.createEntity(styleType, 'MUTABLE', {
    ...more,
    value: value
  });

  const ekey = contentStateWithEntity.getLastCreatedEntityKey();

  return Modifier.applyEntity(content, _sel, ekey);
}

const generalMapping = (contentState, elm, content, lineKeys, more = {}) => {
  return descriptiveStyle(contentState, elm.type, elm.marks, elm.value, content, lineKeys, { astBranch: elm, ...more });
}

const StyleMappings = {
  'Day': generalMapping,
  'Tag': generalMapping,
  'Time': generalMapping,
  'LocationFrom': generalMapping,
  'Location': generalMapping,
  'Comment': generalMapping,
  'Timezone': (contentState, timezone, content, lineKeys, more) => {
    content = generalMapping(contentState, timezone, content, lineKeys, more)
    if (timezone.comment) {
      content = StyleMappings['Comment'](contentState, timezone.comment, content, lineKeys, more)
    }
    return content
  },
  'Trip': (contentState, trip, content, lineKeys, more) => {
    const refs = { ...more, references: trip.references };
    content = StyleMappings['Timespan'](contentState, trip.timespan, content, lineKeys, refs);
    content = StyleMappings['LocationFrom'](contentState, trip.locationFrom, content, lineKeys, { ...more, references: trip.references.from });
    content = StyleMappings['Location'](contentState, trip.locationTo, content, lineKeys, { ...more, references: trip.references.to });
    trip.details.forEach((detail) => {
      content = StyleMappings[detail.type](contentState, detail, content, lineKeys, refs);
    });
    return content;
  },
  'Timespan': (contentState, time, content, lineKeys, more) => {
    content = StyleMappings[time.start.type](contentState, time.start, content, lineKeys, { ...more, timezone: time.timezone, references: more.references.from });
    content = StyleMappings[time.finish.type](contentState, time.finish, content, lineKeys, { ...more, timezone: time.timezone, references: more.references.to });
    return content;
  },
  'Stay': (contentState, stay, content, lineKeys, more) => {
    const refs = { ...more, references: stay.references };
    content = StyleMappings['Timespan'](contentState, stay.timespan, content, lineKeys, refs);
    content = StyleMappings['Location'](contentState, stay.location, content, lineKeys, refs);
    if (stay.comment.type) {
      content = StyleMappings[stay.comment.type](contentState, stay.comment, content, lineKeys, refs);
    }
    stay.details.forEach((detail) => {
      content = StyleMappings[detail.type](contentState, detail, content, lineKeys, refs);
    })
    return content;
  }
}


const decorateAstRoot = (contentState, content, root, lineKeys, more) => {
  root.days.forEach((day) => {
      content = StyleMappings['Day'](contentState, day.day, content, lineKeys, more);
      day.blocks.forEach((block) => {
        const mapping = StyleMappings[block.type];
        if (mapping) {
          content = mapping(contentState, block, content, lineKeys, more);
        }
      });
    })
    return content;
  }
  
const decorateWithAst = (contentState, previousAst, text, content, lineKeys, segments, more) => {
  let ast;
  try {
    ast = buildLifeAst(text, segments);
  } catch (e) {
    return [content, null, e];
  }

  content = decorateAstRoot(contentState, content, ast, lineKeys, more);
  return [content, ast, null];
}
  
const decorate = (previousAst, editorState, segments, dispatch) => {
  let content = editorState.getCurrentContent();
  const sel = editorState.getSelection();
  // immutablejs sequence, that associates line number (index) with draft-js key
  const lineKeys = content.getBlockMap().keySeq();

  const startKey = sel.getStartKey();
  const block = content.getBlockForKey(startKey);
  const blockText = block.getText();

  let warning, ast;

  const text = content.getPlainText();

  const ts = sel.merge({
    focusOffset: blockText.length,
    anchorOffset: 0
  });
  content = Modifier.applyEntity(content, ts, null);

  const res = decorateWithAst(content, previousAst, text, content, lineKeys, segments, { dispatch });
  content = res[0];
  ast = res[1];
  warning = res[2];

  editorState = EditorState.push(editorState, content, 'apply-entity');
  editorState = EditorState.acceptSelection(editorState, sel);
  return [editorState, ast, warning];
}

export default decorate;