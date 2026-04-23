// Hardcoded "nice" prices per currency for each plan.
// Base reference is CAD. Values are rounded to look clean in each currency.

export type CurrencyCode =
  | "CAD"
  | "USD"
  | "INR"
  | "GBP"
  | "EUR"
  | "AUD"
  | "AED"
  | "SAR"
  | "PKR"
  | "BDT"
  | "NGN";

export type PlanKey = "biweekly" | "monthly" | "quarterly";

export interface CurrencyInfo {
  code: CurrencyCode;
  label: string;
  flag: string;
  symbol: string;
  // Symbol position
  symbolBefore?: boolean;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  CAD: { code: "CAD", label: "CAD", flag: "🇨🇦", symbol: "$", symbolBefore: true },
  USD: { code: "USD", label: "USD", flag: "🇺🇸", symbol: "$", symbolBefore: true },
  INR: { code: "INR", label: "INR", flag: "🇮🇳", symbol: "₹", symbolBefore: true },
  GBP: { code: "GBP", label: "GBP", flag: "🇬🇧", symbol: "£", symbolBefore: true },
  EUR: { code: "EUR", label: "EUR", flag: "🇪🇺", symbol: "€", symbolBefore: true },
  AUD: { code: "AUD", label: "AUD", flag: "🇦🇺", symbol: "$", symbolBefore: true },
  AED: { code: "AED", label: "AED", flag: "🇦🇪", symbol: "AED ", symbolBefore: true },
  SAR: { code: "SAR", label: "SAR", flag: "🇸🇦", symbol: "SAR ", symbolBefore: true },
  PKR: { code: "PKR", label: "PKR", flag: "🇵🇰", symbol: "₨", symbolBefore: true },
  BDT: { code: "BDT", label: "BDT", flag: "🇧🇩", symbol: "৳", symbolBefore: true },
  NGN: { code: "NGN", label: "NGN", flag: "🇳🇬", symbol: "₦", symbolBefore: true },
};

// Nice rounded prices per plan per currency.
// CAD baseline: 7 / 12 / 29
export const PRICES: Record<PlanKey, Record<CurrencyCode, number>> = {
  biweekly: {
    CAD: 7,
    USD: 5,
    INR: 449,
    GBP: 4,
    EUR: 5,
    AUD: 8,
    AED: 19,
    SAR: 19,
    PKR: 1499,
    BDT: 599,
    NGN: 7999,
  },
  monthly: {
    CAD: 12,
    USD: 9,
    INR: 799,
    GBP: 7,
    EUR: 8,
    AUD: 14,
    AED: 33,
    SAR: 33,
    PKR: 2499,
    BDT: 999,
    NGN: 13999,
  },
  quarterly: {
    CAD: 29,
    USD: 21,
    INR: 1999,
    GBP: 17,
    EUR: 19,
    AUD: 32,
    AED: 79,
    SAR: 79,
    PKR: 5999,
    BDT: 2499,
    NGN: 33999,
  },
};

// Map common country codes (ISO-3166-1 alpha-2) to a currency.
const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  CA: "CAD",
  US: "USD",
  IN: "INR",
  GB: "GBP",
  IE: "EUR",
  DE: "EUR",
  FR: "EUR",
  ES: "EUR",
  IT: "EUR",
  NL: "EUR",
  BE: "EUR",
  PT: "EUR",
  AT: "EUR",
  GR: "EUR",
  FI: "EUR",
  AU: "AUD",
  NZ: "AUD",
  AE: "AED",
  SA: "SAR",
  PK: "PKR",
  BD: "BDT",
  NG: "NGN",
};

export function currencyFromCountry(countryCode: string | undefined | null): CurrencyCode {
  if (!countryCode) return "CAD";
  return COUNTRY_TO_CURRENCY[countryCode.toUpperCase()] ?? "USD";
}

export function formatPrice(amount: number, code: CurrencyCode): string {
  const info = CURRENCIES[code];
  // Use locale-aware grouping for large numbers (INR, PKR, NGN, BDT)
  const formatted = new Intl.NumberFormat("en-US").format(amount);
  return `${info.symbol}${formatted}`;
}

const STORAGE_KEY = "bigielts:currency";

export function getStoredCurrency(): CurrencyCode | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v && v in CURRENCIES) return v as CurrencyCode;
  } catch {
    // ignore
  }
  return null;
}

export function setStoredCurrency(code: CurrencyCode) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, code);
  } catch {
    // ignore
  }
}

export async function detectCurrencyFromIP(): Promise<CurrencyCode> {
  try {
    const res = await fetch("https://ipapi.co/json/", { cache: "force-cache" });
    if (!res.ok) return "CAD";
    const data = (await res.json()) as { country_code?: string; currency?: string };
    if (data.currency && data.currency in CURRENCIES) {
      return data.currency as CurrencyCode;
    }
    return currencyFromCountry(data.country_code);
  } catch {
    return "CAD";
  }
}
