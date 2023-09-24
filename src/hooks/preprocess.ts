/**
 * Process text before passing it to MathJS
 */
import { currencySymbols } from '../data/currency';

const usePreprocessor = (): { preprocess: (text: string) => string; } => {
  function preprocess(text: string): string {
    if (/(?<=\d)k\b/.test(text))
      text = text.replace(/(?<=\d)k\b/g, '000');


    if (/(?<=\d)M\b/.test(text))
      text = text.replace(/(?<=\d)M\b/g, '000000');

    // Pass dates to date function
    if (/(?<!date\(\s*"?\s*\d{0,3})\b\d{1,4}[-/]\d{1,2}[-/]\d{1,4}( \d{1,2}:\d{2}(:\d{2})?( [AP]M)?( [A-Z]{3})?)?/.test(text))
      text = text.replace(/(?<!date\(\s*"?\s*\d{0,3})\d{1,4}[-/]\d{1,2}[-/]\d{1,4}( \d{1,2}:\d{2}(:\d{2})?( [AP]M)?( [A-Z]{3})?)?/g, 'date("$&")');

    // Quote arguments passed to date function
    if (/date\([^"]+?\)/.test(text))
      text = text.replace(/(date\()([^"]+?)(\))/g, '$1"$2"$3');

    // Remove comments
    if (/\/\/.*/.test(text))
      text = text.replace(/\/\/.*/g, '');

    // Remove commas from numbers
    if (/(?<!\([^)]*)(?<!\[[^\]]*),(\d{3})/.test(text))
      text = text.replace(/(?<!\([^)]*)(?<!\[[^\]]*),(\d{3})/g, '$1');


    // Use currency codes instead of symbols
    Object.entries(currencySymbols).forEach(([code, symbol]) => {
      const removeRegex = new RegExp(`\\${ symbol }([\\d\\.]+\\s*[A-Za-z]{3})`, 'g');
      if (removeRegex.test(text))
        text = text.replace(removeRegex, '$1');

      const replaceRegex = new RegExp(`\\${ symbol }([\\d\\.\\,]+)(?=([^\\d\\.\\,A-Z]|$))(?!\\b\\s*[A-Za-z]{3})`, 'g');
      if (replaceRegex.test(text))
        text = text.replace(replaceRegex, `$1 ${ code }`);

      const inRegex = new RegExp(`\\bin\\s+\\${ symbol }`);
      if (inRegex.test(text))
        text = text.replace(inRegex, `in ${ code }`);

    });

    // Add or subtract percentages
    if (/((\$?[\d.]+\s*\w*)|(\w+))\s*([+-])\s*([\d.]+)%/.test(text))
      text = text.replace(/((\$?[\d.]+\s*\w*)|(\w+))\s*([+-])\s*([\d.]+)%/g, '$1 $4 ($1 * $5 / 100)');

    // Translate "percent off" expressions
    if (/(?<=%)(\s+off( of)?\s+)((\$?[\d.]+\s*\w*)|(\w+))/.test(text))
      text = text.replace(/(?<=%)(\s+off( of)?\s+)((\$?[\d.]+\s*\w*)|(\w+))/g, ' * -$3 + $3');

    // Translate "x percent of what is y" expressions
    if (/(\d+((,\d{3})+)?(\.\d+)?)% of what is (\d+((,\d{3})+)?(\.\d+)?)/.test(text))
      text = text.replace(/(\d+((,\d{3})+)?(\.\d+)?)% of what is (\d+((,\d{3})+)?(\.\d+)?)/g, '(100/$1)*$5');


    // Change percent to fraction
    if (/(\d+((,\d{3})+)?(\.\d+)?)%/.test(text))
      text = text.replace(/([\d.,]+)%/g, '($1/100)');

    // Change "of" to *
    if (/ of /.test(text))
      text = text.replace(/ of /g, ' * ');

    // Replace "x unit ago" with "now - x unit"
    if (/([\d.]+ [A-Za-z]+) ago/.test(text))
      text = text.replace(/([\d.]+ [A-Za-z]+) ago/g, 'now - $1');

    // Replace f or c with degF or degC
    if (/(?<=[\s\d./])([fc])(?![A-Za-z])/.test(text)) {
      text = text.replace(/(?<=[\s\d./])f(?![A-Za-z])/g, 'degF');
      text = text.replace(/(?<=[\s\d./])c(?![A-Za-z])/g, 'degC');
    }
    // Remove new line characters
    text = text.replace(/\\n/g, '');

    return text;
  }

  return { preprocess };
};
export default usePreprocessor;
