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
    const editorRef = React.createRef();
    
    const { state, strategies } = this.props;
    const decorator = new CompositeDecorator(strategies);
    const editorState = EditorState.createWithContent(state, decorator);

    this.previousAst= null;

    this.state = {
      editorState
    };
  }

  componentDidUpdate (prev) {
    if (prev.initial !== this.props.initial) {
      const state = EditorState.push(this.state.editorState, this.props.initial, 'insert-characters');
      this.onChange(state);
    }
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
      let warning;
      [editorState, this.previousAst, warning] = decorate(this.previousAst, editorState);
      if (warning) {
        console.log(warning);
      } 
      this.setState({editorState})
        this.timeout = null
    }, 0);
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