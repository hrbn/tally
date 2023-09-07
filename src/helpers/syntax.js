// CodeMirror streaming language parser for Math.js syntax.

import sortedKeywords, { units, functions, constants, builtins, operatorKeywords } from '../data/keywords';

function words(array) {
  var keys = {};
  for (var i = 0; i < array.length; ++i) {
    keys[array[i]] = true;
  }
  return keys;
}

var OperatorKeywords = words(operatorKeywords);
var Constants = words(constants);
var Functions = words(functions);
var Units = words(units);
var Builtins = words(builtins);

var isOperatorChar = /[+\-*&=<>/:^%!]/;

function tokenBase(stream, state) {
  var ch = stream.next();
  if (ch == '#' || (ch == '/' && stream.eat('/'))) {
    stream.skipToEnd();
    return 'comment';
  }
  if (ch == '"' || ch == "'") {
    state.tokenize = tokenString(ch);
    return state.tokenize(stream, state);
  }
  if (/[$£€¥₽¥]/.test(ch)) {
    return 'variableName.special';
  }
  if (/[[\](),]/.test(ch)) {
    return null;
  }
  if (/[\d.]/.test(ch)) {
    stream.eatWhile(/^(\d+((,\d{3})+)?)?(\.(\d+)?)?(e[+-]?\d+)?(M |k )?$/);
    return 'number';
  }
  if (isOperatorChar.test(ch)) {
    stream.eatWhile(isOperatorChar);
    return 'operator';
  }
  stream.eatWhile(/[\w_]/);
  var word = stream.current();

  if (Object.hasOwn(OperatorKeywords, word)) {
    return 'operatorKeyword';
  }
  if (Object.hasOwn(Constants, word)) {
    return 'variableName.standard';
  }
  if (Object.hasOwn(Builtins, word)) {
    return 'variableName.standard';
  }
  if (Object.hasOwn(Units, word)) {
    return 'variableName.special';
  }
  if (Object.hasOwn(Functions, word)) {
    return 'function';
  }
  if (stream.peek() === '(') {
    return 'variableName.definition';
  }
  return 'variable';
}

function tokenString(quote) {
  return function (stream, state) {
    var escaped = false,
      next,
      end = false;
    while ((next = stream.next()) != null) {
      if (next == quote && !escaped) {
        end = true;
        break;
      }
      escaped = !escaped && next == '\\';
    }
    if (end || !escaped) state.tokenize = null;
    return 'string';
  };
}

// Interface

export const mathjs = {
  name: 'mathjs',
  startState: function () {
    return { tokenize: null };
  },

  token: function (stream, state) {
    if (stream.eatSpace()) return null;
    var style = (state.tokenize || tokenBase)(stream, state);
    if (style == 'comment' || style == 'meta') return style;
    return style;
  },

  languageData: {
    autocomplete: sortedKeywords,
    closeBrackets: { brackets: ['(', '[', '{', "'", '"', '`'] },
    commentTokens: { line: '#' }
  }
};
