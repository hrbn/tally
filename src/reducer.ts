import type { MathJsStatic } from 'mathjs';


export interface State {
  math: MathJsStatic | null;
  doc: string;
  lines: string[];
  results: Map<number, any>;
};


export const initialState: State = {
  math: null,
  doc: localStorage.getItem('doc') || '',
  lines: [],
  results: new Map<number, any>()
};

export type Action =
  | { type: 'SET_MATH'; payload: { math: MathJsStatic | null; }; }
  | { type: 'SET_DOC'; payload: { doc: string; }; }
  | { type: 'SET_LINES'; payload: { lines: string[]; }; }
  | { type: 'SET_RESULTS'; payload: { results: Map<number, any>; }; };

const CalcReducer = (state: State, action: Action): State => {
  const { type, payload } = action;
  switch (type) {
    case 'SET_MATH':
      return {
        ...state,
        math: payload.math
      };
    case 'SET_DOC':
      return {
        ...state,
        doc: payload.doc
      };
    case 'SET_LINES':
      return {
        ...state,
        lines: payload.lines
      };
    case 'SET_RESULTS':
      return {
        ...state,
        results: payload.results
      };
    default:
      throw new Error(`No case for type ${ type } found in CalcReducer.`);
  }
};

export default CalcReducer;