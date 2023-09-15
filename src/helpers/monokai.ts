// Modified Monokai Pro theme for CodeMirror 6. Based on @codemirror/theme-one-dark.

import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';

const white = '#ffffff',
  red = '#ff6188',
  blue = '#78dce8',
  gray = '#939293',
  yellow = '#ffd866',
  green = '#a9dc76',
  orange = '#fc9867',
  purple = '#ab9df2',
  darkBackground = 'var(--joy-palette-neutral-800, #171A1C)',
  highlightBackground = '#4e4e4e',
  // background = '#1c1c1c',
  background = 'transparent',
  tooltipBackground = '#353535',
  selection = '#686868',
  cursor = '#ffd866';

const color = {
  white,
  red,
  blue,
  gray,
  yellow,
  green,
  orange,
  purple,
  darkBackground,
  highlightBackground,
  background,
  tooltipBackground,
  selection,
  cursor
};

const monokaiTheme = EditorView.theme(
  {
    '&': {
      color: white,
      backgroundColor: background
    },
    '&.cm-editor.cm-focused': { 'outline-color': 'transparent' },
    '.cm-content': {
      caretColor: cursor
    },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: cursor, borderLeftWidth: '2px' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': { backgroundColor: selection },
    '.cm-panels': { backgroundColor: darkBackground, color: white },
    '.cm-panels.cm-panels-top': { borderBottom: '2px solid black' },
    '.cm-panels.cm-panels-bottom': { borderTop: '2px solid black' },
    '.cm-searchMatch': {
      backgroundColor: '#72a1ff59',
      outline: '1px solid #457dff'
    },
    '.cm-searchMatch.cm-searchMatch-selected': {
      backgroundColor: '#6199ff2f'
    },
    '.cm-activeLine': { backgroundColor: '#6699ff0b' },
    '.cm-selectionMatch': { backgroundColor: '#aafe661a' },
    '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
      backgroundColor: '#bad0f847',
      outline: '1px solid #515a6b'
    },
    '.cm-gutters': {
      backgroundColor: background,
      color: gray,
      border: 'none',
      userSelect: 'none'
    },
    '.cm-activeLineGutter': {
      backgroundColor: highlightBackground
    },
    '.cm-foldPlaceholder': {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#ddd'
    },
    '.cm-tooltip': {
      border: 'none',
      backgroundColor: tooltipBackground
    },
    '.cm-tooltip .cm-tooltip-arrow:before': {
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent'
    },
    '.cm-tooltip .cm-tooltip-arrow:after': {
      borderTopColor: tooltipBackground,
      borderBottomColor: tooltipBackground
    },
    '.cm-tooltip-autocomplete': {
      '& > ul > li[aria-selected]': {
        backgroundColor: highlightBackground,
        color: white
      }
    }
  },
  { dark: true }
);

const monokaiHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: purple },
  { tag: [tags.name, tags.deleted, tags.character, tags.propertyName, tags.macroName], color: red },
  { tag: [tags.function(tags.variableName), tags.labelName], color: yellow },
  { tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)], color: orange },
  { tag: [tags.definition(tags.name), tags.separator], color: white },
  { tag: [tags.typeName, tags.className, tags.number, tags.changed, tags.annotation, tags.modifier, tags.self, tags.namespace], color: white },
  { tag: [tags.operator, tags.operatorKeyword, tags.url, tags.escape, tags.regexp, tags.link, tags.special(tags.string)], color: blue },
  { tag: [tags.meta, tags.comment], color: gray, fontStyle: 'italic' },
  { tag: tags.strong, fontWeight: 'bold' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.strikethrough, textDecoration: 'line-through' },
  { tag: tags.link, color: gray, textDecoration: 'underline' },
  { tag: tags.heading, fontWeight: 'bold', color: red },
  { tag: [tags.atom, tags.bool, tags.special(tags.variableName)], color: orange, fontStyle: 'italic' },
  { tag: [tags.processingInstruction, tags.string, tags.inserted], color: green },
  { tag: tags.invalid, color: white }
]);

const monokai = [monokaiTheme, syntaxHighlighting(monokaiHighlightStyle)];

export { color, monokai, monokaiHighlightStyle, monokaiTheme };
