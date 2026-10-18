import { vi } from 'vitest';

// The context module reads localStorage on import; tests use the pure functions instead
vi.mock('../src/context', () => ({ useCalc: vi.fn() }));

// Fixed rates keep currency results deterministic and avoid network calls
vi.mock('../src/data/currency', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../src/data/currency')>()),
  fetchExchangeRates: async () => ({
    base: 'USD',
    rates: { USD: 1, EUR: 0.9, GBP: 0.8, JPY: 150, CAD: 1.35, BTC: 0.00002 },
  }),
}));
