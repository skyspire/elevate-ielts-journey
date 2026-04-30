// Hardcoded "nice" prices per currency for each plan.
// Base reference is CAD (7 / 12 / 29). Values are rounded to look clean in each currency.

export type CurrencyCode =
  // North America
  | "CAD" | "USD" | "MXN"
  // South America
  | "BRL" | "ARS" | "CLP" | "COP" | "PEN"
  // Europe
  | "EUR" | "GBP" | "CHF" | "SEK" | "NOK" | "DKK" | "PLN" | "CZK" | "HUF" | "RON" | "BGN" | "TRY" | "UAH" | "RUB"
  // Middle East
  | "AED" | "SAR" | "QAR" | "KWD" | "BHD" | "OMR" | "JOD" | "ILS" | "EGP"
  // Africa
  | "NGN" | "ZAR" | "KES" | "GHS" | "MAD" | "TND" | "DZD" | "ETB" | "UGX" | "TZS"
  // Asia
  | "INR" | "PKR" | "BDT" | "LKR" | "NPR" | "CNY" | "JPY" | "KRW" | "HKD" | "TWD" | "SGD" | "MYR" | "THB" | "IDR" | "PHP" | "VND"
  // Oceania
  | "AUD" | "NZD" | "FJD";

export type PlanKey = "biweekly" | "monthly" | "quarterly";

export interface CurrencyInfo {
  code: CurrencyCode;
  label: string;
  flag: string;
  symbol: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  // North America
  CAD: { code: "CAD", label: "CAD", flag: "🇨🇦", symbol: "$" },
  USD: { code: "USD", label: "USD", flag: "🇺🇸", symbol: "$" },
  MXN: { code: "MXN", label: "MXN", flag: "🇲🇽", symbol: "$" },
  // South America
  BRL: { code: "BRL", label: "BRL", flag: "🇧🇷", symbol: "R$" },
  ARS: { code: "ARS", label: "ARS", flag: "🇦🇷", symbol: "$" },
  CLP: { code: "CLP", label: "CLP", flag: "🇨🇱", symbol: "$" },
  COP: { code: "COP", label: "COP", flag: "🇨🇴", symbol: "$" },
  PEN: { code: "PEN", label: "PEN", flag: "🇵🇪", symbol: "S/" },
  // Europe
  EUR: { code: "EUR", label: "EUR", flag: "🇪🇺", symbol: "€" },
  GBP: { code: "GBP", label: "GBP", flag: "🇬🇧", symbol: "£" },
  CHF: { code: "CHF", label: "CHF", flag: "🇨🇭", symbol: "CHF " },
  SEK: { code: "SEK", label: "SEK", flag: "🇸🇪", symbol: "kr " },
  NOK: { code: "NOK", label: "NOK", flag: "🇳🇴", symbol: "kr " },
  DKK: { code: "DKK", label: "DKK", flag: "🇩🇰", symbol: "kr " },
  PLN: { code: "PLN", label: "PLN", flag: "🇵🇱", symbol: "zł " },
  CZK: { code: "CZK", label: "CZK", flag: "🇨🇿", symbol: "Kč " },
  HUF: { code: "HUF", label: "HUF", flag: "🇭🇺", symbol: "Ft " },
  RON: { code: "RON", label: "RON", flag: "🇷🇴", symbol: "lei " },
  BGN: { code: "BGN", label: "BGN", flag: "🇧🇬", symbol: "лв " },
  TRY: { code: "TRY", label: "TRY", flag: "🇹🇷", symbol: "₺" },
  UAH: { code: "UAH", label: "UAH", flag: "🇺🇦", symbol: "₴" },
  RUB: { code: "RUB", label: "RUB", flag: "🇷🇺", symbol: "₽" },
  // Middle East
  AED: { code: "AED", label: "AED", flag: "🇦🇪", symbol: "AED " },
  SAR: { code: "SAR", label: "SAR", flag: "🇸🇦", symbol: "SAR " },
  QAR: { code: "QAR", label: "QAR", flag: "🇶🇦", symbol: "QAR " },
  KWD: { code: "KWD", label: "KWD", flag: "🇰🇼", symbol: "KWD " },
  BHD: { code: "BHD", label: "BHD", flag: "🇧🇭", symbol: "BHD " },
  OMR: { code: "OMR", label: "OMR", flag: "🇴🇲", symbol: "OMR " },
  JOD: { code: "JOD", label: "JOD", flag: "🇯🇴", symbol: "JOD " },
  ILS: { code: "ILS", label: "ILS", flag: "🇮🇱", symbol: "₪" },
  EGP: { code: "EGP", label: "EGP", flag: "🇪🇬", symbol: "E£" },
  // Africa
  NGN: { code: "NGN", label: "NGN", flag: "🇳🇬", symbol: "₦" },
  ZAR: { code: "ZAR", label: "ZAR", flag: "🇿🇦", symbol: "R" },
  KES: { code: "KES", label: "KES", flag: "🇰🇪", symbol: "KSh " },
  GHS: { code: "GHS", label: "GHS", flag: "🇬🇭", symbol: "GH₵" },
  MAD: { code: "MAD", label: "MAD", flag: "🇲🇦", symbol: "MAD " },
  TND: { code: "TND", label: "TND", flag: "🇹🇳", symbol: "TND " },
  DZD: { code: "DZD", label: "DZD", flag: "🇩🇿", symbol: "DZD " },
  ETB: { code: "ETB", label: "ETB", flag: "🇪🇹", symbol: "Br " },
  UGX: { code: "UGX", label: "UGX", flag: "🇺🇬", symbol: "USh " },
  TZS: { code: "TZS", label: "TZS", flag: "🇹🇿", symbol: "TSh " },
  // Asia
  INR: { code: "INR", label: "INR", flag: "🇮🇳", symbol: "₹" },
  PKR: { code: "PKR", label: "PKR", flag: "🇵🇰", symbol: "₨" },
  BDT: { code: "BDT", label: "BDT", flag: "🇧🇩", symbol: "৳" },
  LKR: { code: "LKR", label: "LKR", flag: "🇱🇰", symbol: "Rs " },
  NPR: { code: "NPR", label: "NPR", flag: "🇳🇵", symbol: "Rs " },
  CNY: { code: "CNY", label: "CNY", flag: "🇨🇳", symbol: "¥" },
  JPY: { code: "JPY", label: "JPY", flag: "🇯🇵", symbol: "¥" },
  KRW: { code: "KRW", label: "KRW", flag: "🇰🇷", symbol: "₩" },
  HKD: { code: "HKD", label: "HKD", flag: "🇭🇰", symbol: "HK$" },
  TWD: { code: "TWD", label: "TWD", flag: "🇹🇼", symbol: "NT$" },
  SGD: { code: "SGD", label: "SGD", flag: "🇸🇬", symbol: "S$" },
  MYR: { code: "MYR", label: "MYR", flag: "🇲🇾", symbol: "RM" },
  THB: { code: "THB", label: "THB", flag: "🇹🇭", symbol: "฿" },
  IDR: { code: "IDR", label: "IDR", flag: "🇮🇩", symbol: "Rp " },
  PHP: { code: "PHP", label: "PHP", flag: "🇵🇭", symbol: "₱" },
  VND: { code: "VND", label: "VND", flag: "🇻🇳", symbol: "₫" },
  // Oceania
  AUD: { code: "AUD", label: "AUD", flag: "🇦🇺", symbol: "$" },
  NZD: { code: "NZD", label: "NZD", flag: "🇳🇿", symbol: "$" },
  FJD: { code: "FJD", label: "FJD", flag: "🇫🇯", symbol: "FJ$" },
};

// Nice rounded prices per plan per currency. CAD baseline: 7 / 12 / 29.
export const PRICES: Record<PlanKey, Record<CurrencyCode, number>> = {
  biweekly: {
    // North America
    CAD: 7, USD: 5, MXN: 99,
    // South America
    BRL: 29, ARS: 4999, CLP: 4999, COP: 19999, PEN: 19,
    // Europe
    EUR: 5, GBP: 4, CHF: 5, SEK: 55, NOK: 55, DKK: 35, PLN: 22, CZK: 119, HUF: 1899, RON: 25, BGN: 9, TRY: 199, UAH: 199, RUB: 499,
    // Middle East
    AED: 19, SAR: 19, QAR: 19, KWD: 2, BHD: 2, OMR: 2, JOD: 4, ILS: 19, EGP: 249,
    // Africa
    NGN: 7999, ZAR: 99, KES: 699, GHS: 79, MAD: 49, TND: 15, DZD: 699, ETB: 599, UGX: 19999, TZS: 13999,
    // Asia
    INR: 449, PKR: 1499, BDT: 599, LKR: 1599, NPR: 699, CNY: 39, JPY: 799, KRW: 6999, HKD: 39, TWD: 159, SGD: 7, MYR: 25, THB: 179, IDR: 79999, PHP: 299, VND: 129000,
    // Oceania
    AUD: 8, NZD: 9, FJD: 12,
  },
  monthly: {
    CAD: 12, USD: 9, MXN: 169,
    BRL: 49, ARS: 8999, CLP: 8499, COP: 34999, PEN: 33,
    EUR: 8, GBP: 7, CHF: 8, SEK: 95, NOK: 95, DKK: 59, PLN: 35, CZK: 199, HUF: 3299, RON: 39, BGN: 15, TRY: 349, UAH: 349, RUB: 849,
    AED: 33, SAR: 33, QAR: 33, KWD: 3, BHD: 3, OMR: 3, JOD: 6, ILS: 33, EGP: 429,
    NGN: 13999, ZAR: 169, KES: 1199, GHS: 139, MAD: 89, TND: 27, DZD: 1199, ETB: 999, UGX: 33999, TZS: 23999,
    INR: 799, PKR: 2499, BDT: 999, LKR: 2799, NPR: 1199, CNY: 65, JPY: 1399, KRW: 11999, HKD: 69, TWD: 279, SGD: 12, MYR: 42, THB: 299, IDR: 139000, PHP: 499, VND: 219000,
    AUD: 14, NZD: 15, FJD: 19,
  },
  quarterly: {
    CAD: 29, USD: 21, MXN: 399,
    BRL: 119, ARS: 21999, CLP: 19999, COP: 84999, PEN: 79,
    EUR: 19, GBP: 17, CHF: 19, SEK: 229, NOK: 229, DKK: 145, PLN: 85, CZK: 479, HUF: 7999, RON: 95, BGN: 37, TRY: 849, UAH: 849, RUB: 1999,
    AED: 79, SAR: 79, QAR: 79, KWD: 7, BHD: 7, OMR: 7, JOD: 15, ILS: 79, EGP: 999,
    NGN: 33999, ZAR: 399, KES: 2799, GHS: 329, MAD: 209, TND: 65, DZD: 2799, ETB: 2399, UGX: 79999, TZS: 56999,
    INR: 1999, PKR: 5999, BDT: 2499, LKR: 6799, NPR: 2799, CNY: 159, JPY: 3299, KRW: 28999, HKD: 169, TWD: 679, SGD: 29, MYR: 99, THB: 749, IDR: 339000, PHP: 1199, VND: 519000,
    AUD: 32, NZD: 35, FJD: 49,
  },
};

// Map ISO-3166-1 alpha-2 country codes to currency.
const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  // North America
  CA: "CAD", US: "USD", MX: "MXN",
  // South America
  BR: "BRL", AR: "ARS", CL: "CLP", CO: "COP", PE: "PEN", UY: "USD", BO: "USD", PY: "USD", VE: "USD", EC: "USD",
  // Europe (Eurozone)
  IE: "EUR", DE: "EUR", FR: "EUR", ES: "EUR", IT: "EUR", NL: "EUR", BE: "EUR", PT: "EUR", AT: "EUR", GR: "EUR",
  FI: "EUR", LU: "EUR", SK: "EUR", SI: "EUR", EE: "EUR", LV: "EUR", LT: "EUR", CY: "EUR", MT: "EUR", HR: "EUR",
  // Europe (other)
  GB: "GBP", CH: "CHF", LI: "CHF", SE: "SEK", NO: "NOK", DK: "DKK", IS: "EUR",
  PL: "PLN", CZ: "CZK", HU: "HUF", RO: "RON", BG: "BGN", TR: "TRY", UA: "UAH", RU: "RUB",
  // Middle East
  AE: "AED", SA: "SAR", QA: "QAR", KW: "KWD", BH: "BHD", OM: "OMR", JO: "JOD", IL: "ILS", EG: "EGP",
  LB: "USD", IQ: "USD", YE: "USD", SY: "USD", IR: "USD",
  // Africa
  NG: "NGN", ZA: "ZAR", KE: "KES", GH: "GHS", MA: "MAD", TN: "TND", DZ: "DZD", ET: "ETB", UG: "UGX", TZ: "TZS",
  RW: "USD", ZM: "USD", ZW: "USD", MZ: "USD", AO: "USD", CM: "EUR", CI: "EUR", SN: "EUR",
  // South Asia
  IN: "INR", PK: "PKR", BD: "BDT", LK: "LKR", NP: "NPR", BT: "INR", MV: "USD", AF: "USD",
  // East / Southeast Asia
  CN: "CNY", JP: "JPY", KR: "KRW", HK: "HKD", TW: "TWD", MO: "HKD",
  SG: "SGD", MY: "MYR", TH: "THB", ID: "IDR", PH: "PHP", VN: "VND",
  KH: "USD", LA: "USD", MM: "USD", BN: "SGD", MN: "USD",
  // Oceania
  AU: "AUD", NZ: "NZD", FJ: "FJD", PG: "AUD", WS: "AUD", TO: "AUD", VU: "AUD", SB: "AUD",
};

export function currencyFromCountry(countryCode: string | undefined | null): CurrencyCode {
  if (!countryCode) return "USD";
  return COUNTRY_TO_CURRENCY[countryCode.toUpperCase()] ?? "USD";
}

export function formatPrice(amount: number, code: CurrencyCode): string {
  const info = CURRENCIES[code];
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
    if (!res.ok) return "USD";
    const data = (await res.json()) as { country_code?: string; currency?: string };
    if (data.currency && data.currency in CURRENCIES) {
      return data.currency as CurrencyCode;
    }
    return currencyFromCountry(data.country_code);
  } catch {
    return "USD";
  }
}

// Grouped list for the dropdown UI.
export const CURRENCY_GROUPS: { label: string; codes: CurrencyCode[] }[] = [
  { label: "Popular", codes: ["CAD", "USD", "INR", "GBP", "EUR", "AUD", "AED"] },
  { label: "North America", codes: ["CAD", "USD", "MXN"] },
  { label: "South America", codes: ["BRL", "ARS", "CLP", "COP", "PEN"] },
  {
    label: "Europe",
    codes: ["EUR", "GBP", "CHF", "SEK", "NOK", "DKK", "PLN", "CZK", "HUF", "RON", "BGN", "TRY", "UAH", "RUB"],
  },
  {
    label: "Middle East",
    codes: ["AED", "SAR", "QAR", "KWD", "BHD", "OMR", "JOD", "ILS", "EGP"],
  },
  {
    label: "Africa",
    codes: ["NGN", "ZAR", "KES", "GHS", "MAD", "TND", "DZD", "ETB", "UGX", "TZS"],
  },
  {
    label: "Asia",
    codes: ["INR", "PKR", "BDT", "LKR", "NPR", "CNY", "JPY", "KRW", "HKD", "TWD", "SGD", "MYR", "THB", "IDR", "PHP", "VND"],
  },
  { label: "Oceania", codes: ["AUD", "NZD", "FJD"] },
];

// Resolve a plan's effective price for a given currency, honoring admin overrides.
export function getPlanPrice(
  planKey: PlanKey,
  currency: CurrencyCode,
  overrides?: Record<string, number>,
): number {
  const o = overrides?.[currency];
  if (typeof o === "number" && !Number.isNaN(o) && o > 0) return o;
  return PRICES[planKey][currency];
}
