import type { MathJsStatic } from 'mathjs';

import { defaultScope } from '../components/Maths';
import { useCalc } from '../context';
import { defaultFormatterSettings, format } from './format';
import { preprocess } from './preprocess';

export function evaluateLines(math: MathJsStatic, lines: string[], scope: Record<string, any> = defaultScope()): Map<number, any> {
  const results = new Map<number, any>();
  const formatterSettings = defaultFormatterSettings();

  lines.forEach((line, lineNumber) => {
    results.set(lineNumber, evaluateLine(line, lineNumber));
  });

  return results;

  function evaluateLine(line: string, lineNumber: number): any {
    let trimmed = line.trim();

    if (!trimmed.length) return null;

    if (trimmed.charAt(0).match(/[+\-*/]/) && lines[lineNumber - 1] !== '') trimmed = `last ${ trimmed }`;

    if (trimmed.match(/\bline(\d+)\b/))
      try {
        trimmed = trimmed.replace(/\bline(\d+)\b/g, (match, p1) => `(${ results.get(Number(p1) - 1) })`);
      } catch (e) {
        return null;
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
          return result;
        }
        return null;

      } catch (error) {
        return null;
      }

    return null;
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


        datapoints.push(format(math, result, settingsClone));
      }
      if (averagePattern.test(line))
        aggregateStr = `${ datapoints.join('+') } / ${ datapoints.length }`;
      else
        aggregateStr = `${ datapoints.join('+') }`;

      return line.replace(aggregationPattern, `(${ aggregateStr })`);
    }
    return line;
  }
}

const useEvaluator = (): { evaluate: () => void; } => {
  const { math, lines, setResults } = useCalc();

  function evaluate() {
    setResults(evaluateLines(math as unknown as MathJsStatic, lines));
  }

  return { evaluate };
};

export default useEvaluator;
