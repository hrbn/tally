import { defaultScope } from '../components/Maths';
import { useCalc } from '../context';
import useFormatter from './format';
import usePreprocessor from './preprocess';

const useEvaluator = (): { evaluate: () => void; } => {
  const { format, defaultFormatterSettings } = useFormatter();
  const { preprocess } = usePreprocessor();
  const formatterSettings = defaultFormatterSettings();
  const { math, lines, results, setResults } = useCalc();

  const updateResults = (k: number, v: any) => {
    setResults(new Map(results.set(k, v)));
  };

  function evaluate() {
    setResults(new Map(results?.clear()));
    const scope = defaultScope();
    lines.map((line, lineNumber) => {
      let trimmed = line.trim();

      if (!trimmed.length) return updateResults(lineNumber, null);

      if (trimmed.charAt(0).match(/[+\-*/]/) && lines[lineNumber - 1] !== '') trimmed = `last ${ trimmed }`;

      if (trimmed.match(/\bline(\d+)\b/))
        try {
          trimmed = trimmed.replace(/\bline(\d+)\b/g, (match, p1) => `(${ results.get(Number(p1) - 1) })`);
        } catch (e) {
          return updateResults(lineNumber, null);
        }


      const aggregated = aggregate(trimmed, lineNumber);
      const preprocessed = preprocess(aggregated);
      let compiled;
      try {
        compiled = math.compile(preprocessed);
      } catch (e) {
        compiled = null;
      }
      if (compiled)
        try {
          const result = compiled.evaluate(scope);
          if (typeof result !== 'function' && typeof result !== 'undefined') {
            scope.last = result;
            return updateResults(lineNumber, result);
          }
          return updateResults(lineNumber, null);

        } catch (error) {
          return updateResults(lineNumber, null);
        }

      return updateResults(lineNumber, null);
    });
  }

  function aggregate(line: string, lineNumber: number): string {
    const aggregationPattern = /\b(sum|total|avg|average|mean)(?!\()/;
    const averagePattern = /\b(avg|average|mean)(?!\()/;
    line = line.trim();

    if (aggregationPattern.test(line)) {
      const settingsClone = { ...formatterSettings };
      settingsClone.displayCommas = false;
      let aggregateStr = '';
      const datapoints: string[] = [];
      for (let thisLine = lineNumber - 1; thisLine >= 0; thisLine--) {
        const result = results.get(thisLine);
        if (result === undefined || result === null || aggregationPattern.test(lines[thisLine].trim()))
          if (datapoints.length > 0)
            break;
          else
            continue;


        datapoints.push(format(result, settingsClone));
      }
      if (averagePattern.test(line))
        aggregateStr = `${ datapoints.join('+') } / ${ datapoints.length }`;
      else
        aggregateStr = `${ datapoints.join('+') }`;

      return line.replace(aggregationPattern, `(${ aggregateStr })`);
    }
    return line;
  }

  return { evaluate };
};

export default useEvaluator;