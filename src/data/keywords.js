import { Unit } from 'mathjs';
import { functions, constants, currency } from './keywords.json';

const units = (() => {
  const baseUnits = Object.keys(Unit.UNITS);
  const builtinUnits = [];
  baseUnits.forEach((e) => {
    const prefixes = Object.keys(Unit.UNITS[e].prefixes);
    if (prefixes.length) builtinUnits.push(...prefixes.map((p) => `${p}${e}`));
    builtinUnits.push(e);
  });
  const additionalUnits = 'px|pixel|pixels|pt|point|points|em|oF|oC|f|c|mph|kph'.split('|');
  return [...builtinUnits, ...additionalUnits, ...currency, ...currency.map((c) => c.toLowerCase())];
})();

const builtins = 'today|tomorrow|now|time|yesterday|sum|total|average|avg'.split('|');
const operatorKeywords = 'in|to|last|off|of|mod|xor|or|ago'.split('|');
const allKeywords = [...units, ...builtins, ...functions, ...operatorKeywords];
const sortedKeywords = allKeywords.sort((a, b) => a.length - b.length).filter((item) => item.length > 0);

export { functions, constants, units, builtins, operatorKeywords };
export default sortedKeywords;
