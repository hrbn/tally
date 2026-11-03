import { createContext, type ReactNode, useCallback, useContext, useEffect, useReducer } from 'react';
import { Maths } from './components/Maths';
import type { State } from './reducer';
import CalcReducer, { initialState } from './reducer';

interface CalcState extends State {
  setDoc: (doc: string) => void;
  setLines: (lines: string[]) => void;
  setResults: (results: Map<number, any>) => void;
}

const CalcContext = createContext<CalcState | undefined>(undefined);

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
          math,
        },
      });
    });
  }, []);

  const setDoc = useCallback((doc: string) => {
    dispatch({
      type: 'SET_DOC',
      payload: {
        doc,
      },
    });
  }, []);

  const setLines = useCallback((lines: string[]) => {
    dispatch({
      type: 'SET_LINES',
      payload: {
        lines,
      },
    });
  }, []);

  const setResults = useCallback((results: Map<number, any>) => {
    dispatch({
      type: 'SET_RESULTS',
      payload: {
        results,
      },
    });
  }, []);

  const value: CalcState = {
    math: state.math,
    doc: state.doc,
    lines: state.lines,
    results: state.results,
    setDoc,
    setLines,
    setResults,
  };
  return <CalcContext.Provider value={value}>{children}</CalcContext.Provider>;
};

const useCalc = (): CalcState => {
  const context = useContext(CalcContext);

  if (context === undefined) throw new Error('useCalc must be used within CalcContext');

  return context;
};

export { CalcProvider, useCalc };
