import { createContext, useReducer, useContext, useEffect, ReactNode } from 'react';
import { ReactCodeMirrorProps } from '@uiw/react-codemirror';

import CalcReducer, { initialState } from './reducer';
import { Maths } from './components/Maths';

interface CalcState {
  math: null;
  doc: string;
  lines: string[];
  results: Map<any, any>;
}

const CalcContext = createContext<CalcState | undefined>(initialState);

interface CalcProviderProps {
  children: ReactNode;
}

const CalcProvider: React.FC<CalcProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(CalcReducer, initialState);

  useEffect(() => {
    Maths().then((math) => {
      dispatch({
        type: 'SET_MATH',
        payload: {
          math
        }
      });
    });
  }, []);

  const setDoc = (doc: string) => {
    dispatch({
      type: 'SET_DOC',
      payload: {
        doc
      }
    });
  };

  const setLines = (lines: string[]) => {
    dispatch({
      type: 'SET_LINES',
      payload: {
        lines
      }
    });
  };

  const setResults = (results: Map<any, any>) => {
    dispatch({
      type: 'SET_RESULTS',
      payload: {
        results
      }
    });
  };

  const value: CalcState = {
    math: state.math,
    doc: state.doc,
    lines: state.lines,
    results: state.results,
    setDoc,
    setLines,
    setResults
  };
  return <CalcContext.Provider value={value}>{children}</CalcContext.Provider>;
};

const useCalc = (): CalcState => {
  const context = useContext(CalcContext);

  if (context === undefined) {
    throw new Error('useCalc must be used within CalcContext');
  }

  return context;
};

export { useCalc, CalcProvider };
