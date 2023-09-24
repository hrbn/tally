import { currencySymbols, currencyUnits } from '../data/currency';
import { useCalc } from '../context';

interface FormatterSettings {
  lowerExp: number;
  upperExp: number;
  precision: number;
  notation: string;
  displayCommas: boolean;
  trimTrailingZeros: boolean;
}

const useFormatter = (): {
  format: (value: any, formatterSettings?: FormatterSettings) => any;
  defaultFormatterSettings: () => FormatterSettings;
} => {
  const { math } = useCalc();

  function format(value: any, formatterSettings: FormatterSettings = defaultFormatterSettings()): any {
    if (value instanceof Date) {
      if (value.getHours() || value.getMinutes() || value.getSeconds() || value.getMilliseconds())
        return value.toLocaleString();

      return value.toLocaleDateString();
    }

    let stringOutput = math.format(value, (number: number) => {
      const options: any = {
        lowerExp: formatterSettings.lowerExp,
        upperExp: formatterSettings.upperExp,
        precision: formatterSettings.precision,
        notation: formatterSettings.notation,
      };

      if (isCurrency(value)) {
        options.precision = 2;
        options.notation = 'fixed';
        formatterSettings.trimTrailingZeros = false;
      }

      let output = math.format(number, options);

      if (formatterSettings.trimTrailingZeros)
        if (/^-?\d+\.\d+$/.test(output))
          output = output.replace(/0+$/, '').replace(/\.$/, '');



      if (formatterSettings.displayCommas)
        if (/^-?\d+(\.\d+)?$/.test(output))
          output = output.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');



      return output;
    });

    Object.entries(currencySymbols).forEach(([code, symbol]) => {
      symbol += symbol === '$' ? '$' : '';
      const replaceRegex = new RegExp(`\\b([\\d\\.\\,]+) ${ code }`, 'g');
      if (replaceRegex.test(stringOutput))
        stringOutput = stringOutput.replace(replaceRegex, `${ symbol }$1`);

    });

    return stringOutput;
  }

  function isCurrency(value: any): boolean {
    try {
      const u = math.unit(value)?.units[0]?.unit?.name;
      if (!u?.length) return false;
      return currencyUnits.includes(u.toUpperCase());
    } catch (e) {
      return false;
    }
  }

  function defaultFormatterSettings(): FormatterSettings {
    return {
      lowerExp: -9,
      upperExp: 9,
      precision: 8,
      notation: 'auto',
      displayCommas: true,
      trimTrailingZeros: true,
    };
  }

  return { format, defaultFormatterSettings };
};

export default useFormatter;