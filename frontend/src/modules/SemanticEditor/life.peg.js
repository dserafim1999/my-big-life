import peg from 'pegjs';

const simpleParserString = String.raw`
{
// equivalent of { ...obj, ...that }
const extend = (obj, that) => {
  return Object.assign({}, obj, that)
}
const d = (type, obj, marksExt) => {
  const {start, end} = location()
  const offset = start.column-1
  const length = end.column - start.column
  const line = start.line - 1
  return extend({type, marks: extend({offset, length, line}, marksExt)}, obj)
}
const push = (elm, arr) => {
  arr.push(elm)
  return arr
}
const append = (elm, arr) => {
  arr.unshift(elm)
  return arr
}
}

Days
  = days:DayBlock+ {
    return { type: 'Days', days }
  }

DayBlock
  = e:Empty day:DayDate _ nl+ blocks:StaysTrips { return { day, blocks } }

StaysTrips
  = head:StayTrip nl+ rest:StaysTrips { return append(head, rest) }
  / st:StayTrip { return [st] }

StayTrip
  = Timezone
  / Trip
  / Stay
  / Empty

Empty
  = Comment
  / nl*

StayTripBlock
  = Stay


nl "new line"
  = '\n'

DayDate
  = "--" year:([0-9]+) "_" month:([0-9]+) "_" day:([0-9]+) { return d('Day', { value: { year: Number(year.join('')), month: Number(month.join('')), day: Number(day.join('')) } }) }

Stay
  = timespan:Timespan _ location:Location details:Details* comment:_ {
  return { type: 'Stay', timespan, location, comment, details }
  }

TimezoneOffset
  = "+" offset:[0-9]+ { return Number(offset.join('')) }
  / "-" offset:[0-9]+ { return -Number(offset.join('')) }

Timezone "timezone"
  = "@"? "UTC" offset:TimezoneOffset? ws:ws comment:Comment? { return d('Timezone', { value: offset || 0, comment }) }

Timespan
  = start:Time "-" finish:Time ":" {
  return d('Timespan', { start, finish } , { length: start.marks.length + finish.marks.length + 1 })
  }

Time "time"
  = [0-9]+ { return d('Time', { value: text() }) }

Trip
  = timespan:Timespan _ locationFrom:LocationFrom _ locationTo:Location details:Details* comment:_ {
  return { type: 'Trip', timespan, locationFrom, locationTo, details, comment }
  }

Location "location"
  = [^\n\[\{;]* {
  const value = text().trim()
  return d('Location', { value }, { length: value.length })
  }

LocationFrom
  = h:[^\n\[\{;] _ '->' {
  return d('LocationFrom', { value: h }, { length: 1 })
  //return { value: '', marks: { length: 0 } }
  }
  / h:[^\n\[\{;] r:LocationFrom {
  return d('LocationFrom', { value: h + r.value }, { length: 1 + r.marks.length })
  }


Tag
  = '[' label:[^\]\n]* closed:']'? {
  return d('Tag', { value: label.join(''), closed: !!closed })
  }

Semantic
  = '{' label:[^\}\n]* '}'? {
  return d('Tag', { value: label.join(''), closed: !!closed })
  }

Details
  = _ r:Tag { return r }
  / _ r:Semantic { return r }

ws
  = [ \t]*

_
  = Comment
  / [ \t]*

__
  = [ \t]+

Comment "comment"
  = ';' r:[^\n]* { return d('Comment', {value: r.join('')}) }
`;

export default peg.generate(simpleParserString, { cache: true });