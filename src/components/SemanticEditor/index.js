import React, { Component } from 'react';

import { Editor, Modifier, CompositeDecorator, EditorState, SelectionState } from 'draft-js';
import suggest from './suggest';

import decorate from './decorate';

import SuggestionBox from '../SuggestionBox';

class SemanticEditor extends Component {
  constructor (props) {
    super(props);
    this.previousAst = null;
    this.warning = null;
    this.timeout = null;

    const editorRef = React.createRef();
    
    const { state, strategies } = this.props;
    const decorator = new CompositeDecorator(strategies);
    
    const editorState = this.decorate(EditorState.createWithContent(state, decorator));

    this.state = {
      editorState,
      suggestions: {
        show: false,
        list: [],
        selected: -1,
        box: { left: 0, top: 0 },
        details: { begin: 0, end: 0 },
        tab: () => {}
      }
    };
  }

  componentDidUpdate (prev, prevState) {
    if (prev.initial !== this.props.initial) {
      const state = EditorState.push(this.state.editorState, this.props.initial, 'insert-characters');
      this.onChange(state);
    } else if (prev.segments !== this.props.segments) {
      const editorState = this.decorate(this.state.editorState);
      this.setState({editorState, suggestions: this.state.suggestions});
    }
  }

  decorate (editorState) {
    let warning;
    [editorState, this.previousAst, warning] = decorate(this.previousAst, editorState, this.props.segments, this.props.dispatch);
    if (warning) {
      this.warning = warning;
    } else {
      this.warning = null;
    }
    return editorState;
  }

  suggest (editorState) {
    suggest(editorState, this.props.suggestionGetters, (suggestions) => {
      this.setState({ editorState, suggestions });
    }, this.editorRef.current, this.state.suggestions);
  }

  onChange (editorState) {
    const previousText = this.state.editorState.getCurrentContent().getPlainText();
    const currentText = editorState.getCurrentContent().getPlainText();
    
    this.setState({editorState, suggestions: this.state.suggestions});

    if (previousText === currentText) {
      this.suggest(editorState);
      return;
    }

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      editorState = this.decorate(editorState);
      this.setState({editorState, suggestions: this.state.suggestions});
      this.timeout = null;
    }, 100);
  }

  onUpArrow (e) {
    let { list, selected, show } = this.state.suggestions;

    if (show) {
      e.preventDefault();
      this.state.suggestions.selected = Math.abs(selected - 1) % list.length;
      this.setState(this.state);
    }
  }

  onDownArrow (e) {
    let { list, selected, show } = this.state.suggestions;

    if (show) {
      e.preventDefault();
      this.state.suggestions.selected = Math.abs(selected + 1) % list.length;
      this.setState(this.state);
    }
  }

  onReturn (e) {
    let { list, selected } = this.state.suggestions;
    if (selected >= 0) {
      this.onSuggestionSelect(list[selected]);
      return true;
    } else {
      return false;
    }
  }

  onSuggestionSelect (suggestion) {
    const { editorState, suggestions } = this.state;
    const { data, setter, details } = this.state.suggestions;
    
    let range = SelectionState.createEmpty(details.key);
    range = range.merge({
      anchorOffset: details.begin,
      focusOffset: details.end
    });
    let content = editorState.getCurrentContent();
    content = Modifier.replaceText(content, range, suggestion);
    // TODO replace value in entity
    let newEditorState = this.decorate(EditorState.push(editorState, content, 'insert-characters'));
    const sl = editorState.getSelection().merge({
      hasFocus: false
    });
    newEditorState = EditorState.acceptSelection(newEditorState, sl);
    suggestions.show = false;
    this.setState({
      editorState: newEditorState,
      suggestions
    });
  }

  onTab (e) {
    e.preventDefault();
    const { editorState } = this.state;

    const sel = editorState.getSelection();
    const startKey = sel.getStartKey();
    const sindex = sel.getStartOffset();
    let content = editorState.getCurrentContent();
    const lineKey = content.getBlockMap().keySeq();
    const line = lineKey.findIndex((lk) => lk === startKey);

    const findBlockEntities = (block) => {
      let ranges = [];
      block.findEntityRanges((c) => c.getEntity() !== null, (begin, end) => ranges.push({ begin, end }));
      return ranges;
    }

    lineKey.slice(line).find((lk) => {
      const block = content.getBlockForKey(lk);
      const index = lk === startKey ? sindex : 0;
      let ranges = findBlockEntities(block);
      const range = ranges.find((range) => range.begin > index);

      // found a next entity to jump
      if (range) {
        const newSel = sel.merge({
          anchorKey: lk,
          focusKey: lk,
          anchorOffset: range.begin,
          focusOffset: range.begin
        });
        const editorState = EditorState.forceSelection(this.state.editorState, newSel);
        this.onChange(editorState);

        return true;
      } else {
        // if there are no tag or semantic information, initialize it
        // if there is but is empty, remove
      }

      return false;
    })
  }

  onEsc () {
    if (this.state.suggestions.show) {
      this.state.suggestions.show = false;
      this.setState(this.state);
    }
  }

  render () {
    const { editorState, suggestions } = this.state;
    const { selected, list, show, box: { left, top } } = suggestions;

    return (
      <div>
        <Editor
          editorState={editorState}
          onChange={this.onChange.bind(this)}
          stripPastedStyles={true}
          onDownArrow={this.onDownArrow.bind(this)}
          onUpArrow={this.onUpArrow.bind(this)}
          handleReturn={this.onReturn.bind(this)}
          onEscape={this.onEsc.bind(this)}
          onTab={this.onTab.bind(this)}
          ref={this.editorRef}
          spellcheck={false}
        />
        <SuggestionBox
          left={left}
          top={top}
          show={show}
          selected={selected}
          onSelect={this.onSuggestionSelect.bind(this)}
          suggestions={list}
        />
      </div>
    );
  }
}

export default SemanticEditor;