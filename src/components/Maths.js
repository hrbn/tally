import * as mathjs from 'mathjs';
import { fetchExchangeRates } from '../data/currency';

export const Maths = async () => {
  const exchangeRates = await fetchExchangeRates();

  const config = {
    epsilon: 1e-60,
    number: 'BigNumber',
    precision: 64
  };

  const math = mathjs.create(mathjs.all, config);

  const addDate = math.factory('add', ['typed'], ({ typed }) => {
    return typed('add', {
      'Date, Unit': function (a, b) {
        return new Date(a.getTime() + b.toNumber('ms'));
      },
      'Unit, Date': function (a, b) {
        return new Date(a.toNumber('ms') + b.getTime());
      }
    });
  });

  const subtractDate = math.factory('subtract', ['typed'], ({ typed }) => {
    return typed('subtract', {
      'Date, Unit': function (a, b) {
        return new Date(a.getTime() - b.toNumber('ms'));
      },
      'Date, Date': function (a, b) {
        return math.unit(a.getTime() - b.getTime(), 'ms').to('s');
      }
    });
  });
  math.import([addDate, subtractDate], {});
  math.import(
    {
      date: parseDate,
      epoch: parseDate
    },
    {}
  );
  math.createUnit('tps');
  math.createUnit('pixel', {
    aliases: ['pixels', 'px'],
    definition: math.evaluate('1 inch/96') // 96 pixels per inch
  });
  math.createUnit(
    'point',
    {
      aliases: ['points', 'pt'],
      definition: math.evaluate('1 px/0.75') // 1px is .75 pt
    },
    { override: true }
  );
  math.createUnit('em', {
    aliases: ['rem'],
    definition: '16 px'
  });
  math.createUnit('mph', {
    definition: '1 miles/hour'
  });
  math.createUnit('kph', {
    definition: '1 kilometers/hour'
  });
  math.import(
    {
      hexToChar: hexToChar,
      charToHex: charToHex
    },
    {}
  );

  math.createUnit(exchangeRates.base, { aliases: [exchangeRates.base.toLowerCase()] });
  const doNotAlias = ['cup'];
  let loaded = 1;
  Object.keys(exchangeRates.rates)
    .filter((currency) => currency !== exchangeRates.base)
    .forEach((currency) => {
      math.createUnit(currency, {
        definition: math.unit(`${1 / exchangeRates.rates[currency]}${exchangeRates.base}`),
        aliases: [doNotAlias.includes(currency.toLowerCase()) ? '' : currency.toLowerCase()]
      });
      loaded += 1;
    });

  console.log('Loaded definitions for %d currencies.', loaded);

  math.createUnit('penny', {
    aliases: ['pennies', '¢', 'cent', 'cents'],
    definition: math.evaluate('0.01 USD')
  });
  math.createUnit('nickel', {
    aliases: ['nickels'],
    definition: math.evaluate('0.05 USD')
  });
  math.createUnit('dime', {
    aliases: ['dimes'],
    definition: math.evaluate('0.1 USD')
  });
  math.createUnit('quarter', {
    aliases: ['quarters'],
    definition: math.evaluate('0.25 USD')
  });

  return math;
};

export function defaultScope() {
  let yesterday = today();
  yesterday.setDate(yesterday.getDate() - 1);
  let tomorrow = today();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const currentTime = new Date();
  return {
    today: today(),
    now: currentTime,
    time: currentTime,
    yesterday: yesterday,
    tomorrow: tomorrow
  };
}
function today() {
  let today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  return today;
}
function parseDate(input) {
  let inputAsString = input.toString();
  if (isNumber(inputAsString)) {
    if (inputAsString.length < 12) {
      inputAsString += '000';
    }
    return new Date(Number(inputAsString));
  }
  return new Date(inputAsString);
}
function isNumber(value) {
  return value != null && value !== '' && !isNaN(Number(value.toString()));
}
function hexToChar(input) {
  const hexes = input.match(/.{1,4}/g) || [];
  var string = '';
  for (var hex of hexes) {
    string += String.fromCharCode(parseInt(hex, 16));
  }
  return string;
}
function charToHex(input) {
  var result = '';
  for (var index = 0; index < input.length; index++) {
    var hex = input.charCodeAt(index).toString(16);
    result += `000${hex}`.slice(-4);
  }
  return result.toUpperCase();
}
