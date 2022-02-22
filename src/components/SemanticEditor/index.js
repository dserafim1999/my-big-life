import React, { Component } from 'react'
import { detect } from 'async'
import { convertToRaw, SelectionState, Modifier, Entity, Editor, EditorState, CompositeDecorator, ContentState } from 'draft-js'
import LIFEParser from '../utils/life.peg.js'

import SuggestionBox from '../SuggestionBox.js'

import findSuggestions from '../utils/findSuggestions'
import completeWithSuggestion from '../utils/completeWithSuggestion'
import findSuggestionBoxPosition from '../utils/findSuggestionBoxPosition'

class SemanticEditor extends Component {
  constructor (props) {
    super(props)
    const editorRef = React.createRef()
    const decorator = new CompositeDecorator(props.strategies)

    const { initial } = props

    this.state = {
      editorState: EditorState.createWithContent(initial, decorator),suggestions: {
        show: false,
        list: [],
        selected: -1,
        box: { left: 0, top: 0 },
        details: { begin: 0, end: 0 },
        tab: () => {}
      }
    }
  }

  focus () {
    this.editorRef.current.focus()
  }

  componentDidUpdate (prev) {
    if (prev.initial !== this.props.initial) {
      const state = EditorState.push(this.state.editorState, this.props.initial, 'insert-characters')
      this.onChange(state)
    }
  }

  onChange (editorState, hide = false) {
    const sel = editorState.getSelection()
    const startKey = sel.getStartKey()
    const index = sel.getStartOffset()
    let content = editorState.getCurrentContent()
    const lineKey = content.getBlockMap().keySeq()
    const line = lineKey.findIndex((lk) => lk === startKey)
    const block = content.getBlockForKey(startKey)

    const blockText = block.getText()
    const segs = this.props.segments.toList()

    try {
      const parts = LIFEParser.parse(content.getPlainText())
      const processPart = (part, n, modeId) => {
        if (!part) {
          return
        }
        if (part.values) {
          part.forEach((p, i) => processPart(p, i))
        } else {
          switch (part.type) {
            case 'Trip':
              processPart(part.timespan, n)
              processPart(part.locationFrom, n)
              processPart(part.locationTo, n)
              part.tmodes.forEach((d, i) => processPart(d, n, i))
              part.details.forEach((d) => processPart(d, n))
              break
            case 'TMode':
              processPart(part.timespan, n)
              part.details.forEach((d, i) => processPart(d, n, modeId))
              break
            case 'Tag':
            case 'Timespan':
            case 'LocationFrom':
            case 'Location':
              const start = part.offset
              const end = part.offset + part.length

              const _sel = new SelectionState({
                anchorOffset: start,
                anchorKey: lineKey.get(part.line),
                focusKey: lineKey.get(part.line),
                focusOffset: end,
                isBackward: false,
                hasFocus: false
              })
              const ekey = Entity.create(part.type, 'MUTABLE', { value: part.value, segment: segs.get(n), dispatch: this.props.dispatch, modeId })
              content = Modifier.applyEntity(content, _sel, ekey)
              break
          }
        }
      }

      const ts = sel.merge({
        focusOffset: blockText.length,
        anchorOffset: 0
      })
      content = Modifier.applyEntity(content, ts, null)

      processPart(parts)
      editorState = EditorState.push(editorState, content, 'apply-entity')
      editorState = EditorState.acceptSelection(editorState, sel)

    } catch (e) {
      console.log(blockText)
      console.error(e)
    }

    const entityKey = block.getEntityAt(index)

    const shouldShow = sel.getHasFocus()
    const contentText = content.getPlainText('\n')

    this.state.editorState = editorState
    this.state.suggestions.show = false
    this.setState(this.state)

    // findSuggestions(text, index, this.props.strategies, (result) => {
    //   if (this.state.editorState === editorState) {
    //     const { strategy, suggestions, begin, end } = result
    //     const tabCompletion = strategy ? strategy.tabCompletion : null
    //     const show = hide ? false : (suggestions.length > 0)
    //     this.setState({
    //       editorState,
    //       suggestions: {
    //         show,
    //         list: suggestions,
    //         selected: -1,
    //         box: findSuggestionBoxPosition(this.editorRef.current, this.state.suggestions.box),
    //         details: { begin, end },
    //         tab: tabCompletion
    //       }
    //     })
    //   } else {
    //     this.state.suggestions.show = false
    //     this.setState(this.state)
    //   }
    // })
    // this.props.onChange()
  }

  onUpArrow (e) {
    let { list, selected, show } = this.state.suggestions

    if (show) {
      e.preventDefault()
      this.state.suggestions.selected = Math.abs(selected - 1) % list.length
      this.setState(this.state)
    }
  }

  onDownArrow (e) {
    let { list, selected, show } = this.state.suggestions

    if (show) {
      e.preventDefault()
      this.state.suggestions.selected = Math.abs(selected + 1) % list.length
      this.setState(this.state)
    }
  }

  onReturn (e) {
    let { list, selected } = this.state.suggestions
    if (selected >= 0) {
      this.onSuggestionSelect(list[selected])
      return true
    } else {
      return false
    }
  }

  onSuggestionSelect (suggestion) {
    const { data, setter } = this.state.suggestions
    setter(suggestion, data)
  }

  onTab (e) {
    e.preventDefault()
    const { tab } = this.state.suggestions
    if (tab) {
      const newEditorState = tab(this.state.editorState)
      if (newEditorState) {
        this.onChange(newEditorState)
      }
    }
  }

  onEsc () {
    if (this.state.suggestions.show) {
      this.state.suggestions.show = false
      this.setState(this.state)
    }
  }

  render () {
    const { className } = this.props
    const { editorState, suggestions } = this.state
    const { selected, list, show, box: { left, top } } = suggestions

    return (
      <div style={{ fontFamily: 'monospace', width: '100%', lineHeight: '170%' }} className={className}>
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
    )
  }
}

export default SemanticEditor