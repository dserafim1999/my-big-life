import React, { useRef } from 'react'
import { connect } from 'react-redux'
import DownIcon from '@mui/icons-material/KeyboardArrowDown'
import { fromJS } from 'immutable'

import SemanticEditor from './SemanticEditor/index.js'
import findWithRegex from './utils/findWithRegex'
import generateTabFromSeparator from './utils/generateTabFromSeparator'

const RegExStrategy = (regEx, captureGroup = 0, log = null) => {
    return (contentBlock, callback) => {
      findWithRegex(regEx, contentBlock, callback, captureGroup, log)
    }
}

const SemanticPill = (props) => {
  return (
    <span onClick={ () => {} } className='tag is-info'>{props.children}<DownIcon/></span>
  )
}
  
const PLACES = [
    'home',
    'work',
    'school',
    'wife\'s work',
    'gym',
    'central park'
]

const PLACES_TO = [
    'home_',
    'work_',
    'school_',
    'wife\'s work_',
    'gym_',
    'central park_'
]

const TAGS = [
    'walk',
    'bike',
    'bus',
    'car',
    'train',
    'subway',
    'concert',
    'movies'
]

const SEMANTIC = [
    'Start Wars',
    'McDonalds',
    'AC/DC'
]
  
const suggestionRegExStrat = (re) => {
    return (text) => re.exec(text)
}
  
const staticSuggestionGetter = (suggestions, offset = 1) => {
    return (matched, callback) => {
      callback({
        suggestions: suggestions.filter((s) => s.match(matched[1])),
        begin: matched.index + offset,
        end: matched.index + offset + matched[1].length
      })
    }
}
  
const SuggestionsStrategies = [
    {
        id: 'hours',
        strategy: RegExStrategy(/^(\d{4}-\d{4})/g, 1),
        tabCompletion: generateTabFromSeparator(':'),
        component: SemanticPill
      },
      {
        id: 'placeFrom',
        suggestionStrategy: suggestionRegExStrat(/\:\s*([^\[\{\-\>]*)/),
        suggester: staticSuggestionGetter(PLACES),
        tabCompletion: generateTabFromSeparator('->'),
        strategy: RegExStrategy(/(\:\s*)([^\[\{\-\>]*)/g, 2),
        component: SemanticPill
      },
      {
        suggestionStrategy: suggestionRegExStrat(/\-\>\s*([^\[\{\-\>]*)$/),
        suggester: staticSuggestionGetter(PLACES_TO, 2),
        id: 'placeTo',
        strategy: RegExStrategy(/(\-\>\s*)([^\[\{\-\>]*)/g, 2),
        component: SemanticPill,
        tabCompletion: generateTabFromSeparator('', /(\-\>\s*)([^\[\{\-\>]*)/g, '[', 2)
      },
      {
        id: 'tags',
        suggestionStrategy: suggestionRegExStrat(/\[([^\]]*)\]?/),
        suggester: staticSuggestionGetter(TAGS),
        tabCompletion: generateTabFromSeparator(']', /\[([^\]]*)\]?/g, '{'),
        strategy: RegExStrategy(/\[([^\]]*)\]?/g),
        component: SemanticPill
      },
      {
        id: 'semantic',
        suggestionStrategy: suggestionRegExStrat(/\{([^\}]*)\}?/),
        suggester: staticSuggestionGetter(SEMANTIC),
        tabCompletion: generateTabFromSeparator('}', /\{([^\}]*)\}?/g),
        strategy: RegExStrategy(/\{([^\}]*)\}?/g),
        component: SemanticPill
      }
]
  
const createStateTextRepresentation = (segments) => {
    let buff = [];
    segments.forEach((segment) => {
      const start = segment.get('start')
      const end = segment.get('end')
      const from = fromJS(segment.get('locations')).get(0)
      const to = fromJS(segment.get('locations')).get(1)
      const transp = fromJS(segment.get('transportationModes'))

      const DATE_FORMAT = 'HHmm'
      const span = start.format(DATE_FORMAT) + '-' + end.format(DATE_FORMAT)
      
      let line = span + ': '
      line = line + from.get('label')

      if (to) {
        line = line + ' -> ' + to.get('label')
      }
  
      if (transp) {
        if (transp.count() === 1) {
          line = line + ' [' + transp.get('label') + ']'
        } else {
          const transports = transp.map((t) => {
            const label = t.get('label')
            const points = segment.get('points')
            const from = points.get(t.get('from'))
            const to = points.get(t.get('to'))
            const tSpan = from.get('time').format(DATE_FORMAT) + '-' + to.get('time').format(DATE_FORMAT)
            return '    ' + tSpan + ': [' + label + ']'
          }).toJS()
  
          line = line + '\n' + transports.join('\n')
        }
      }
  
      buff.push(line)
    })
    
    return buff.join('\n')
}

let SE = ({ segments }) => {
  const state = createStateTextRepresentation(segments)
  return (
    <SemanticEditor strategies={SuggestionsStrategies} initial={ state } segments={ segments }>
    </SemanticEditor>
  )
}

const mapStateToProps = (state) => {
    return {
      segments: state.get('tracks').get('segments')
    }
  }
  
SE = connect(mapStateToProps)(SE)

export default SE