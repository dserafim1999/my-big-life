import React, { Component } from 'react';

import {
  Editor,
  EditorState,
  CompositeDecorator
} from 'draft-js';

import decorate from './decorate';

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
      editorState
    };
  }

  componentDidUpdate (prev) {
    if (prev.initial !== this.props.initial) {
      const state = EditorState.push(this.state.editorState, this.props.initial, 'insert-characters');
      this.onChange(state);
    } else if (prev.segments !== this.props.segments) {
      const editorState = this.decorate(this.state.editorState);
      this.setState({editorState});
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

  onChange (editorState) {
    const previousText = this.state.editorState.getCurrentContent().getPlainText();
    const currentText = editorState.getCurrentContent().getPlainText();
    this.setState({editorState});

    if (previousText === currentText) {
      return;
    }

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      editorState = this.decorate(editorState);
      this.setState({editorState});
      this.timeout = null;
    }, 100);
  }

  render () {
    const { editorState } = this.state;

    return (
      <Editor
        editorState={editorState}
        onChange={this.onChange.bind(this)}
        stripPastedStyles={true}
        ref={this.editorRef}
        spellcheck={false}
      />
    );
  }
}

export default SemanticEditor;