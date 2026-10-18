import { describe, expect, it } from 'vitest';

import { preprocess } from '../src/hooks/preprocess';

describe('preprocess', () => {
  it.each([
    ['5k', '5000'],
    ['2M', '2000000'],
    ['5k USD', '5000 USD'],
    ['5km', '5km'],
    ['1.5k', '1500'],
    ['0.5k', '500'],
    ['1.5M', '1500000'],
    ['1.23456k', '1234.56'],
    ['0.0005k', '0.5'],
    ['1.5k + 2M', '1500 + 2000000'],
    ['1,001k', '1001000'],
    ['1,000k', '1000000'],
    ['1,001M', '1001000000'],
    ['1,000M', '1000000000'],
    ['1,000,001.5k', '1000001500'],
    ['f(1,001k)', 'f(1,1000)'],
    ['[1,000k]', '[1,0]'],
  ])('expands magnitude suffixes: %s', (input, expected) => {
    expect(preprocess(input)).toBe(expected);
  });

  it.each([
    ['$5', '5 usd'],
    ['$1,000', '1000 usd'],
    ['$1,000.50', '1000.50 usd'],
    ['$5 + $3', '5 usd + 3 usd'],
    ['£10', '10 gbp'],
    ['€20', '20 eur'],
    ['¥100', '100 jpy'],
    ['$5 USD', '5 USD'],
    ['10 USD in $', '10 USD in usd'],
    ['100 GBP in £', '100 GBP in gbp'],
  ])('converts currency symbols to codes: %s', (input, expected) => {
    expect(preprocess(input)).toBe(expected);
  });

  it.each([
    ['2023-01-15', 'date("2023-01-15")'],
    ['1/2/2023', 'date("1/2/2023")'],
    ['2023-01-15 13:45', 'date("2023-01-15 13:45")'],
    ['date(2023-01-15)', 'date("2023-01-15")'],
    ['date("2023-01-15")', 'date("2023-01-15")'],
  ])('wraps dates in date(): %s', (input, expected) => {
    expect(preprocess(input)).toBe(expected);
  });

  it.each([
    ['3 days ago', 'now - 3 days'],
    ['2 weeks ago', 'now - 2 weeks'],
  ])('rewrites "ago": %s', (input, expected) => {
    expect(preprocess(input)).toBe(expected);
  });

  it('strips comments', () => {
    expect(preprocess('2 + 3 // comment')).toBe('2 + 3 ');
  });

  it.each([
    ['1,000,000', '1000000'],
    ['1,234.56', '1234.56'],
    ['1,000 + 2,000', '1000 + 2000'],
    ['f(1,000)', 'f(1,000)'],
    ['[1,000, 2]', '[1,000, 2]'],
  ])('strips thousands separators outside calls and matrices: %s', (input, expected) => {
    expect(preprocess(input)).toBe(expected);
  });

  it.each([
    ['50%', '(50/100)'],
    ['12.5%', '(12.5/100)'],
    ['20% of 50', '(20/100) * 50'],
    ['5 + 10%', '5  + (5  * 10 / 100)'],
    ['$50 - 20%', '50 usd - (50 usd * 20 / 100)'],
    ['x + 5%', 'x + (x * 5 / 100)'],
    ['20% off $50', '(20/100) * -50 usd + 50 usd'],
    ['20% off of 50', '(20/100) * -50 + 50'],
    ['10% of what is 5', '(100/10)*5'],
  ])('translates percentages: %s', (input, expected) => {
    expect(preprocess(input)).toBe(expected);
  });

  it.each([
    ['100 f to c', '100 degF to degC'],
    ['100f', '100degF'],
    ['5 c', '5 degC'],
    ['cat', 'cat'],
    ['f(2)', 'f(2)'],
    ['c = 5', 'c = 5'],
    ['100 f in c', '100 degF in degC'],
  ])('maps f and c to temperature units: %s', (input, expected) => {
    expect(preprocess(input)).toBe(expected);
  });

  it.each([
    ['2 * f(3)', '2 * f(3)'],
    ['3 f(2)', '3 f(2)'],
    ['x = f(2) + 1', 'x = f(2) + 1'],
    ['a * c', 'a * c'],
  ])('leaves f and c alone when used as names: %s', (input, expected) => {
    expect(preprocess(input)).toBe(expected);
  });

  it.each([
    ['sqrt(25)'],
    ['5.5 inch to cm'],
    ['abc'],
  ])('passes plain expressions through: %s', (input) => {
    expect(preprocess(input)).toBe(input);
  });
});
