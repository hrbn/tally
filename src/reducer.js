export const initialState = {
  math: null,
  doc: localStorage.getItem('doc') || '',
  lines: [],
  results: new Map()
};

const CalcReducer = (state, action) => {
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
      throw new Error(`No case for type ${type} found in CalcReducer.`);
  }
};
export default CalcReducer;
