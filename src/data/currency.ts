import axios from 'axios';

interface ExchangeRateResponse {
  base: string;
  rates: Record<string, number>;
}

// Default fallback response when the API call fails
export const defaultExchangeRates: ExchangeRateResponse = {
  base: 'USD',
  rates: { USD: 1.0 },
};

/**
 * Fetches exchange rates from the CurrencyFreaks API.
 * Gracefully handles API failures by returning default exchange rates.
 * @returns ExchangeRateResponse with base currency and exchange rates, or default values if API call fails
 */
export const fetchExchangeRates = async (): Promise<ExchangeRateResponse> => {
  try {
    const apiKey = import.meta.env.VITE_CURRENCY_API_KEY;
    if (!apiKey) {
      console.warn('No API key found for currency exchange rates. Using default USD rate only.');
      return defaultExchangeRates;
    }
    
    const response = await axios.get(`https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${apiKey}`);
    
    if (!response?.data?.rates || Object.keys(response.data.rates).length === 0) {
      console.warn('Invalid response from currency exchange rate API. Using default USD rate only.');
      return defaultExchangeRates;
    }
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    return defaultExchangeRates;
  }
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