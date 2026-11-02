import { StreamLanguage } from '@codemirror/language';
import { StateEffect } from '@codemirror/state';
import { EditorView, ViewUpdate } from '@codemirror/view';
import { BoxProps } from '@mui/joy';
import Box from '@mui/joy/Box';
import * as alls from '@uiw/codemirror-themes-all';
import type { ReactCodeMirrorProps } from '@uiw/react-codemirror';
import CodeMirror, { useCodeMirror } from '@uiw/react-codemirror';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useCalc } from '../context';
import { monokai } from '../helpers/monokai';
import { mathjs } from '../helpers/syntax';
import useEvaluator from '../hooks/evaluate';
import useResultPlugin from '../hooks/results';
import { useTheme } from '../hooks/theme';

interface EditorProps extends BoxProps {
  // Define additional props here if needed
}

const Editor: FC<EditorProps> = (props) => {
  // biome-ignore lint/correctness/noUnusedVariables: cursor line is tracked but not displayed yet
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const { doc, lines, setDoc, setLines } = useCalc();
  const { evaluate } = useEvaluator();
  const { theme, setTheme } = useTheme();
  const [init, setInit] = useState(false);

  const lineResults = useResultPlugin();
  const extensions = [StreamLanguage.define(mathjs), lineResults(), EditorView.lineWrapping];

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-evaluate only when the lines change or the editor finishes loading
  useEffect(() => {
    evaluate();
  }, [lines, init]);

  const onChange = (value: string, viewUpdate: ViewUpdate) => {
    setDoc(value);
    setLines(Array.from(viewUpdate.state.doc.iterLines()));

    localStorage.setItem('doc', value);
    const cursorLine = viewUpdate.state.doc.lineAt(viewUpdate.state.selection.main.from).number;
    setCurrentLine(cursorLine);
  };

  const onUpdate = useCallback((viewUpdate: ViewUpdate) => {
    const cursorLine = viewUpdate.state.doc.lineAt(viewUpdate.state.selection.main.from).number;
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
          indentOnInput: true,
        }}
        extensions={[StreamLanguage.define(mathjs), lineResults(), EditorView.lineWrapping]}
        theme={((alls as Record<string, any>)[theme] || theme) as ReactCodeMirrorProps['theme']}
        onChange={onChange}
        onUpdate={onUpdate}
        height="100%"
      />
    </Box>
  );
};

export default Editor;
