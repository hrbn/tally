import * as mathjs from 'mathjs';
import { currencyUnits, fetchExchangeRates } from '../data/currency';

export const Maths = async (): Promise<mathjs.MathJsStatic> => {
  const exchangeRates = await fetchExchangeRates();

  const config = {
    epsilon: 1e-60,
    number: 'BigNumber',
    precision: 64,
  };

  const math = mathjs.create(mathjs.all, config);

  const addDate = math.factory('add', ['typed'], ({ typed }) => typed('add', {
    'Date, Unit' (a: Date, b: mathjs.Unit) {
      return new Date(a.getTime() + b.toNumber('ms'));
    },
    'Unit, Date' (a: mathjs.Unit, b: Date) {
      return new Date(a.toNumber('ms') + b.getTime());
    },
  }));

  const subtractDate = math.factory('subtract', ['typed'], ({ typed }) => typed('subtract', {
    'Date, Unit' (a: Date, b: mathjs.Unit) {
      return new Date(a.getTime() - b.toNumber('ms'));
    },
    'Date, Date' (a: Date, b: Date) {
      return math.unit(a.getTime() - b.getTime(), 'ms').to('s');
    },
  }));

  math.import([addDate, subtractDate], {});
  math.import(
    {
      date: parseDate,
      epoch: parseDate,
    },
    {},
  );

  math.createUnit('tps');
  math.createUnit('pixel', {
    aliases: ['pixels', 'px'],
    definition: math.evaluate('1 inch/96'), // 96 pixels per inch
  });
  math.createUnit(
    'point',
    {
      aliases: ['points', 'pt'],
      definition: math.evaluate('1 px/0.75'), // 1px is .75 pt
    },
    { override: true },
  );
  math.createUnit('em', {
    aliases: ['rem'],
    definition: '16 px',
  });
  math.createUnit('mph', {
    definition: '1 miles/hour',
  });
  math.createUnit('kph', {
    definition: '1 kilometers/hour',
  });
  math.import(
    {
      hexToChar,
      charToHex,
    },
    {},
  );

  math.createUnit(exchangeRates.base, { aliases: [exchangeRates.base.toLowerCase()] });
  const doNotAlias = ['cup', 'T'];
  let loaded = 1;
  Object.keys(exchangeRates.rates)
    .filter((currency) => currency !== exchangeRates.base && currencyUnits.includes(currency))
    .forEach((currency) => {
      math.createUnit(currency, {
        definition: math.unit(`${ 1 / exchangeRates.rates[currency] }${ exchangeRates.base }`),
        aliases: [doNotAlias.includes(currency.toLowerCase()) ? '' : currency.toLowerCase()],
      });
      loaded += 1;
    });

  console.log('Loaded definitions for %d currencies.', loaded);

  math.createUnit('penny', {
    aliases: ['pennies', '¢', 'cent', 'cents'],
    definition: math.evaluate('0.01 USD'),
  });
  math.createUnit('nickel', {
    aliases: ['nickels'],
    definition: math.evaluate('0.05 USD'),
  });
  math.createUnit('dime', {
    aliases: ['dimes'],
    definition: math.evaluate('0.1 USD'),
  });
  math.createUnit('quarter', {
    aliases: ['quarters'],
    definition: math.evaluate('0.25 USD'),
  });

  return math;
};

export function defaultScope(): Record<string, Date> {
  const yesterday = today();
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = today();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const currentTime = new Date();
  return {
    today: today(),
    now: currentTime,
    time: currentTime,
    yesterday,
    tomorrow,
  };
}

function today(): Date {
  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  return today;
}

function parseDate(input: number | string): Date {
  const inputAsString = String(input);
  const parsedInput = isNumber(inputAsString) ? inputAsString.padEnd(12, '0') : inputAsString;
  return new Date(Number(parsedInput));
}

function isNumber(value: string | null): boolean {
  return value !== null && value !== '' && !isNaN(Number(value));
}

function hexToChar(input: string): string {
  const hexes = input.match(/.{1,4}/g) || [];
  return hexes.map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
}

function charToHex(input: string): string {
  return [...input].map(char => char.charCodeAt(0).toString(16)
    .padStart(4, '0')).join('')
    .toUpperCase();
}