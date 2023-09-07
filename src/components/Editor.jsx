import { useState, useCallback, useEffect } from 'react';
import { useCalc } from '../context';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import useResultPlugin from '../hooks/results';
import { monokai } from '../helpers/monokai';
import { StreamLanguage } from '@codemirror/language';
import Box from '@mui/joy/Box';

import { mathjs } from '../helpers/syntax';
import useEvaluator from '../hooks/evaluate';

export default function Editor(props) {
  // eslint-disable-next-line no-unused-vars
  const [currentLine, setCurrentLine] = useState();
  const { doc, lines, setDoc, setLines } = useCalc();
  const { evaluate } = useEvaluator();

  const lineResults = useResultPlugin();

  useEffect(() => {
    evaluate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines]);

  const onChange = (value, viewUpdate) => {
    setDoc(value);
    setLines(Array.from(viewUpdate.state.doc.iterLines()));

    localStorage.setItem('doc', value);

    const cursorLine = viewUpdate.state.doc.lineAt(viewUpdate.state.selection.ranges[0].from).number;
    setCurrentLine(cursorLine);
  };

  const onUpdate = useCallback((viewUpdate) => {
    const cursorLine = viewUpdate.state.doc.lineAt(viewUpdate.state.selection.ranges[0].from).number;
    setCurrentLine(cursorLine);
  }, []);

  const onCreateEditor = () => {
    setLines(doc.split('\n'));
  };

  return (
    <Box sx={{ paddingTop: 2 }} {...props}>
      <CodeMirror
        value={doc}
        onCreateEditor={onCreateEditor}
        basicSetup={{
          foldGutter: false,
          dropCursor: true,
          allowMultipleSelections: false,
          indentOnInput: true
        }}
        className="vh-100 vw-100 pb-4 font-monospace"
        extensions={[StreamLanguage.define(mathjs), lineResults(), EditorView.lineWrapping]}
        theme={monokai}
        onChange={onChange}
        onUpdate={onUpdate}
        height="100%"
      />
    </Box>
  );
}
