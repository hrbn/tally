import { useState, useCallback, useEffect, useMemo, useRef, FC } from 'react';
import { useCalc } from '../context';
import CodeMirror, { useCodeMirror } from '@uiw/react-codemirror';
import { EditorView, ViewUpdate } from '@codemirror/view';
import { StateEffect } from '@codemirror/state';
import useResultPlugin from '../hooks/results';
import { monokai } from '../helpers/monokai';
import { useTheme } from '../hooks/theme';

import * as alls from '@uiw/codemirror-themes-all';

import { StreamLanguage } from '@codemirror/language';
import Box from '@mui/joy/Box';
import { BoxProps } from '@mui/joy';

import { mathjs } from '../helpers/syntax';
import useEvaluator from '../hooks/evaluate';

interface EditorProps extends BoxProps {
  // Define additional props here if needed
}

const Editor: FC<EditorProps> = (props) => {
  // eslint-disable-next-line no-unused-vars
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const { doc, lines, setDoc, setLines, settings } = useCalc();
  const { evaluate } = useEvaluator();
  const { theme, setTheme } = useTheme();
  const [init, setInit] = useState(false);

  const lineResults = useResultPlugin();
  const extensions = [StreamLanguage.define(mathjs), lineResults(), EditorView.lineWrapping];

  useEffect(() => {
    evaluate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, init]);

  const onChange = (value: string, viewUpdate: ViewUpdate) => {
    setDoc(value);
    setLines(Array.from(viewUpdate.state.doc.iterLines()));

    localStorage.setItem('doc', value);
    const cursorLine = viewUpdate.state.doc.lineAt(viewUpdate.state.selection.ranges[0].from).number;
    setCurrentLine(cursorLine);
  };

  const onUpdate = useCallback((viewUpdate: ViewUpdate) => {
    const cursorLine = viewUpdate.state.doc.lineAt(viewUpdate.state.selection.ranges[0].from).number;
    setCurrentLine(cursorLine);
  }, []);

  const onCreateEditor = () => {
    setLines(doc.split('\n'));
    // add delay for rendering results on first load
    setTimeout(() => {
      setInit(!init);
    }, 500);
  };

  const editor = useRef();

  return (
    <Box {...props}>
      <CodeMirror
        value={doc}
        onCreateEditor={onCreateEditor}
        basicSetup={{
          foldGutter: false,
          dropCursor: true,
          allowMultipleSelections: false,
          indentOnInput: true
        }}
        extensions={[StreamLanguage.define(mathjs), lineResults(), EditorView.lineWrapping]}
        theme={alls[theme as keyof typeof alls] || theme}
        onChange={onChange}
        onUpdate={onUpdate}
        height="100%"
      />
    </Box>
  );
};

export default Editor;
