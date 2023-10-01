import axios from 'axios';

export const fetchExchangeRates = async (): Promise<any> => {
  const response = await axios.get('https://api.currencyfreaks.com/v2.0/rates/latest?apikey=05248d62f5b349a4bd1150e4c9db82db');
  return (
    response?.data ?? {
      base: 'USD',
      rates: { USD: 1.0 },
    }
  );
};

export const currencyUnits: string[] =
  'AED|AFN|ALL|AMD|ANG|AOA|ARS|AUD|AWG|AZN|BAM|BBD|BDT|BGN|BHD|BIF|BMD|BND|BOB|BRL|BSD|BTC|BTN|BWP|BYN|BZD|CAD|CDF|CHF|CLF|CLP|CNH|CNY|COP|CRC|CUC|CUP|CVE|CZK|DJF|DKK|DOP|DZD|EGP|ERN|ETB|EUR|FJD|FKP|GBP|GEL|GGP|GHS|GIP|GMD|GNF|GTQ|GYD|HKD|HNL|HRK|HTG|HUF|IDR|ILS|IMP|INR|IQD|IRR|ISK|JEP|JMD|JOD|JPY|KES|KGS|KHR|KMF|KPW|KRW|KWD|KYD|KZT|LAK|LBP|LKR|LRD|LSL|LYD|MAD|MDL|MGA|MKD|MMK|MNT|MOP|MRU|MUR|MVR|MWK|MXN|MYR|MZN|NAD|NGN|NIO|NOK|NPR|NZD|OMR|PAB|PEN|PGK|PHP|PKR|PLN|PYG|QAR|RON|RSD|RUB|RWF|SAR|SBD|SCR|SDG|SEK|SGD|SHP|SLL|SOS|SRD|SSP|STD|STN|SVC|SYP|SZL|THB|TJS|TMT|TND|TOP|TRY|TTD|TWD|TZS|UAH|UGX|USD|UYU|UZS|VES|VND|VUV|WST|XAF|XAG|XAU|XCD|XDR|XOF|XPD|XPF|XPT|YER|ZAR|ZMW|ZWL'.split(
    '|',
  );

export const currencySymbols = {
  usd: '$',
  gbp: '£',
  eur: '€',
  jpy: '¥',
  rub: '₽',
  cny: '¥',
};