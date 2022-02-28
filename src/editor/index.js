import React, { Component, createRef } from 'react';

import { 
  Editor as DraftEditor,
  Modifier,
  CompositeDecorator, 
  EditorState, 
  SelectionState 
} from 'draft-js';

import suggest from './suggest';
import decorate from './decorate';
import { selectNextEntity } from './selectNextEntity';

import SuggestionBox from './SuggestionBox';
import Gutter from './Gutter';

import WarningIcon from '@mui/icons-material/Warning';
import { Tooltip } from '@mui/material';

class Editor extends Component {
  constructor (props) {
    super(props);
    this.previousAst = null;
    this.warning = null;
    this.timeout = null;

    this.editorRef = createRef();
    
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
      if (this.state.editorState === editorState) {
        this.setState({ editorState: this.state.editorState, suggestions });
      }
    }, this.editorRef.current, this.state.suggestions);
  }

  onChange (editorState, shouldSuggest = true) {
    const previousText = this.state.editorState.getCurrentContent().getPlainText();
    const currentText = editorState.getCurrentContent().getPlainText();
    
    this.setState({editorState, suggestions: this.state.suggestions});

    if (previousText === currentText && shouldSuggest) {
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

      if (this.props.onChange) {
        this.props.onChange(editorState, this.previousAst, currentText);
      }
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
    const { editorState } = this.state;
    const { details, entityType, data } = this.state.suggestions;
    const isClosed = data.astBranch.closed || false;
    const { key, begin, end } = details;

    let range = SelectionState.createEmpty(key);
    
    range = range.merge({
      anchorOffset: entityType === 'Tag' ? begin + 1 : begin,
      focusOffset: entityType === 'Tag' && isClosed ? end - 1 : end
    });

    let content = editorState.getCurrentContent();
    content = Modifier.replaceText(content, range, suggestion);
    // TODO replace value in entity
    let newEditorState = this.decorate(EditorState.push(editorState, content, 'insert-characters'));
    const sl = editorState.getSelection().merge({
      hasFocus: false
    });
    newEditorState = EditorState.acceptSelection(newEditorState, sl);
    this.onChange(newEditorState, false);

    // Hides suggestion box
    this.state.suggestions.show = false;
    this.setState(this.state);
  }

  onTab (e) {
    e.preventDefault();
    const isBackwards = e.shiftKey;
    let { editorState } = this.state;
    this.onChange(selectNextEntity(editorState, isBackwards));
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

    const gutterStyle = {
      paddingRight: '6px',
      color: '#d3d6db',
      textAlign: 'right'
    };

    const flexStyle = {
      display: 'flex'
    };

    const editorStyle = {
      ...flexStyle,
      fontFamily: 'monospace'
    };

    return (
      <div style={editorStyle} onClick={() => this.editorRef.current.focus()}>
        <div style={flexStyle}>
          <Gutter editorState={editorState} defaultGutter={(i) => i + 1} style={gutterStyle}>
            {
              this.warning && this.warning.location.start.line === i
              ? <Tooltip title={this.warning.message} placement="top" arrow><WarningIcon color='#fcda73'/></Tooltip>
              : null
            }
          </Gutter>
        </div>
        <div style={{ display: 'flex' }}>
          <DraftEditor
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
        </div>
        <SuggestionBox
          onSelect={this.onSuggestionSelect.bind(this)}
          suggestions={list}
          left={left} top={top} show={show} selected={selected} />
      </div>
    );
  }
}

export default Editor;