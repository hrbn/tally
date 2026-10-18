import type { MathJsStatic } from 'mathjs';
import { beforeAll, describe, expect, it } from 'vitest';

import { Maths } from '../src/components/Maths';
import { defaultFormatterSettings, format } from '../src/hooks/format';

let math: MathJsStatic;

beforeAll(async () => {
  math = await Maths();
});

describe('format', () => {
  it.each([
    ['1234567.891', '1,234,567.9'],
    ['-1234.5', '-1,234.5'],
    ['0.1 + 0.2', '0.3'],
    ['1.50', '1.5'],
    ['1e12', '1e+12'],
    ['1e-12', '1e-12'],
  ])('formats numbers: %s', (expression, expected) => {
    expect(format(math, math.evaluate(expression))).toBe(expected);
  });

  it('omits commas when displayCommas is off', () => {
    const settings = { ...defaultFormatterSettings(), displayCommas: false };
    expect(format(math, math.evaluate('1234567'), settings)).toBe('1234567');
  });

  it('keeps trailing zeros when trimTrailingZeros is off', () => {
    const settings = { ...defaultFormatterSettings(), notation: 'fixed', precision: 3, trimTrailingZeros: false };
    expect(format(math, math.evaluate('1.5'), settings)).toBe('1.500');
  });

  it.each([
    ['5 usd', '$5.00'],
    ['1234.5 usd', '$1,234.50'],
    ['3 eur', '€3.00'],
    ['2 gbp', '£2.00'],
    ['5 USD', '5.00 USD'],
    ['100 JPY', '100.00 JPY'],
  ])('formats currency to two decimals: %s', (expression, expected) => {
    expect(format(math, math.evaluate(expression))).toBe(expected);
  });

  it.each([
    ['5.4 kg', '5.4 kg'],
    ['2 inch to cm', '5.08 cm'],
  ])('formats units: %s', (expression, expected) => {
    expect(format(math, math.evaluate(expression))).toBe(expected);
  });

  // Compared against toLocale* so the tests don't depend on the machine's locale
  it('formats a date without a time', () => {
    const date = new Date(2026, 0, 15);
    expect(format(math, date)).toBe(date.toLocaleDateString());
  });

  it('formats a date with a time', () => {
    const date = new Date(2026, 0, 15, 13, 45);
    expect(format(math, date)).toBe(date.toLocaleString());
  });
});
