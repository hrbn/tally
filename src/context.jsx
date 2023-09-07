import { createContext, useReducer, useContext, useEffect } from 'react';
import CalcReducer, { initialState } from './reducer';
import { Maths } from './components/Maths';

const CalcContext = createContext(initialState);

const CalcProvider = ({ children }) => {
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

  const setDoc = (doc) => {
    dispatch({
      type: 'SET_DOC',
      payload: {
        doc
      }
    });
  };

  const setLines = (lines) => {
    dispatch({
      type: 'SET_LINES',
      payload: {
        lines
      }
    });
  };

  const setResults = (results) => {
    dispatch({
      type: 'SET_RESULTS',
      payload: {
        results
      }
    });
  };

  const value = {
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

const useCalc = () => {
  const context = useContext(CalcContext);

  if (context === undefined) {
    throw new Error('useCalc must be used within CalcContext');
  }

  return context;
};

export { useCalc, CalcProvider };
