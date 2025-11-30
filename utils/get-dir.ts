export function getDir(locale: string = "en"): "ltr" | "rtl" {
  // Extract just the language part ("ar" from "ar-SA", "en" from "en-US")
  const lang = locale.split("-")[0].toLowerCase();

  // List of all RTL language codes (ISO 639-1)
  const rtlLangs = new Set([
    "ar", // Arabic
    "he", // Hebrew
    "fa", // Persian (Farsi)
    "ur", // Urdu
    "ps", // Pashto
    "dv", // Divehi
    "ku", // Kurdish (Sorani)
    "sd", // Sindhi
  ]);

  return rtlLangs.has(lang) ? "rtl" : "ltr";
}
