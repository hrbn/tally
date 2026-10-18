import type { MathJsStatic } from 'mathjs';
import { beforeAll, describe, expect, it } from 'vitest';

import { Maths } from '../src/components/Maths';
import { evaluateLines } from '../src/hooks/evaluate';
import { format } from '../src/hooks/format';

let math: MathJsStatic;

beforeAll(async () => {
  math = await Maths();
});

function evaluateDoc(lines: string[]): (string | null)[] {
  return [...evaluateLines(math, lines).values()].map((result) => (result === null ? null : format(math, result)));
}

describe('evaluateLines', () => {
  it('evaluates each line', () => {
    expect(evaluateDoc(['2 + 3', 'sqrt(16)', '2 inch to cm'])).toEqual(['5', '4', '5.08 cm']);
  });

  it('returns null for blank, comment, and invalid lines', () => {
    expect(evaluateDoc(['', '# note', '2 +', '5 // five'])).toEqual([null, null, null, '5']);
  });

  it('carries variables and functions across lines', () => {
    expect(evaluateDoc(['x = 2', 'double(n) = n * 2', 'double(x) + 1'])).toEqual(['2', null, '5']);
  });

  describe('aggregation', () => {
    it.each([
      ['sum', '6'],
      ['total', '6'],
    ])('%s adds the lines above', (keyword, expected) => {
      expect(evaluateDoc(['1', '2', '3', keyword])[3]).toBe(expected);
    });

    it.each([
      ['avg', '2'],
      ['average', '2'],
      ['mean', '2'],
    ])('%s averages the lines above', (keyword, expected) => {
      expect(evaluateDoc(['1', '2', '3', keyword])[3]).toBe(expected);
    });

    it('stops at a blank line', () => {
      expect(evaluateDoc(['1', '2', '', '3', '4', 'sum'])[5]).toBe('7');
    });

    it('stops at a previous aggregate', () => {
      expect(evaluateDoc(['1', '2', 'sum', '10', '20', 'sum'])).toEqual(['1', '2', '3', '10', '20', '30']);
    });

    it('works inside an expression', () => {
      expect(evaluateDoc(['10', '20', 'sum * 2'])[2]).toBe('60');
    });

    it('ignores thousands separators in the values it sums', () => {
      expect(evaluateDoc(['1,000', '2,000', 'sum'])[2]).toBe('3,000');
    });

    it('sums currency values', () => {
      expect(evaluateDoc(['$5', '$10', 'sum'])[2]).toBe('$15.00');
    });

    it('averages currency values', () => {
      expect(evaluateDoc(['$5', '$10', 'avg'])[2]).toBe('$7.50');
    });
  });

  describe('continuation', () => {
    it('applies a leading operator to the previous result', () => {
      expect(evaluateDoc(['10', '+ 5', '* 2'])).toEqual(['10', '15', '30']);
    });

    it('does not continue across a blank line', () => {
      expect(evaluateDoc(['10', '', '+ 5'])).toEqual(['10', null, '5']);
    });

    it('returns null on the first line', () => {
      expect(evaluateDoc(['+ 5'])).toEqual([null]);
    });
  });

  describe('line references', () => {
    it('substitutes earlier results', () => {
      expect(evaluateDoc(['3', '4', 'line1 + line2'])[2]).toBe('7');
    });

    it('keeps units', () => {
      expect(evaluateDoc(['3 inch', 'line1 to cm'])[1]).toBe('7.62 cm');
    });
  });

  it('converts currencies with the loaded rates', () => {
    expect(evaluateDoc(['10 USD in EUR', '$20 in £'])).toEqual(['9.00 EUR', '£16.00']);
  });

  it('calls a user function named f', () => {
    expect(evaluateDoc(['f(x) = x + 1', '2 * f(3)'])[1]).toBe('8');
  });

  // Bug: results hold a reference to the matrix, so later edits change earlier results
  it.fails('keeps each result as it was when its line ran', () => {
    expect(evaluateDoc(['b = zeros(2, 2)', 'b[1, 1] = 5'])[0]).toBe('[[0, 0], [0, 0]]');
  });
});
