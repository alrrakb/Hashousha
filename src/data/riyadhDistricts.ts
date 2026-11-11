export const RIYADH_DISTRICTS = [
  "الملقا",
  "النرجس",
  "الياسمين",
  "حطين",
  "الصحافة",
  "العارض",
  "الروضة",
  "قرطبة",
  "الغدير",
  "الربيع",
  "التعاون",
  "الرمال",
  "المونسية",
  "إشبيلية",
  "العليا",
  "السليمانية",
  "المعذر",
  "الدرعية",
  "النخيل",
  "حي السفارات",
  "لبن",
  "السويدي",
  "الشفا",
] as const

export const OTHER_DISTRICT_KEY = "حي آخر (إدخال يدوي)"

export const SAUDI_PHONE_REGEX = /^(05|\+?9665)\d{8}$/

/**
 * Validates whether a given string is a valid Saudi mobile phone number.
 * Accepts formats: 05xxxxxxxx, +9665xxxxxxxx, 9665xxxxxxxx.
 */
export function isValidSaudiPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s-]/g, "")
  return SAUDI_PHONE_REGEX.test(cleaned)
}

/**
 * Normalizes a Saudi mobile phone number to the canonical standard format: 05XXXXXXXX.
 */
export function normalizeSaudiPhone(phone: string): string {
  const cleaned = phone.replace(/[\s-]/g, "")
  if (cleaned.startsWith("+966")) {
    return "0" + cleaned.slice(4)
  }
  if (cleaned.startsWith("966")) {
    return "0" + cleaned.slice(3)
  }
  return cleaned
}
