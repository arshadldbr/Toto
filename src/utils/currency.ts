import { CurrencyConfig } from '../types';

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  PKR: {
    code: 'PKR',
    symbol: '₨',
    name: 'Pakistani Rupee',
    symbolPosition: 'before',
    decimals: 0,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    symbolPosition: 'before',
    decimals: 2,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    symbolPosition: 'before',
    decimals: 2,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    symbolPosition: 'before',
    decimals: 2,
  },
  AED: {
    code: 'AED',
    symbol: 'AED ',
    name: 'UAE Dirham',
    symbolPosition: 'before',
    decimals: 2,
  },
  SAR: {
    code: 'SAR',
    symbol: 'SAR ',
    name: 'Saudi Riyal',
    symbolPosition: 'before',
    decimals: 2,
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    symbolPosition: 'before',
    decimals: 0,
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$',
    name: 'Canadian Dollar',
    symbolPosition: 'before',
    decimals: 2,
  },
  AUD: {
    code: 'AUD',
    symbol: 'AU$',
    name: 'Australian Dollar',
    symbolPosition: 'before',
    decimals: 2,
  },
};

export function getCurrencyConfig(code: string): CurrencyConfig {
  return SUPPORTED_CURRENCIES[code] || SUPPORTED_CURRENCIES.PKR;
}

export function formatCurrency(
  amount: number,
  currencyCode: string = 'PKR',
  options?: { compact?: boolean; hideSymbol?: boolean }
): string {
  const config = getCurrencyConfig(currencyCode);
  const num = Number.isFinite(amount) ? amount : 0;

  if (options?.compact && Math.abs(num) >= 1000000) {
    const compactValue = (num / 1000000).toFixed(1) + 'M';
    if (options?.hideSymbol) return compactValue;
    return config.symbolPosition === 'before'
      ? `${config.symbol}${compactValue}`
      : `${compactValue} ${config.symbol}`;
  }

  if (options?.compact && Math.abs(num) >= 1000) {
    const compactValue = (num / 1000).toFixed(1) + 'k';
    if (options?.hideSymbol) return compactValue;
    return config.symbolPosition === 'before'
      ? `${config.symbol}${compactValue}`
      : `${compactValue} ${config.symbol}`;
  }

  const formattedNum = num.toLocaleString(undefined, {
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  });

  if (options?.hideSymbol) {
    return formattedNum;
  }

  return config.symbolPosition === 'before'
    ? `${config.symbol}${formattedNum}`
    : `${formattedNum} ${config.symbol}`;
}
