export type Lang = "hr" | "en";

type Dict = Record<string, { hr: string; en: string }>;

const DICT: Dict = {
  // App
  app_tagline: { hr: "Generator dokumenata", en: "Document generator" },
  templates: { hr: "Predlošci", en: "Templates" },
  history: { hr: "Povijest", en: "History" },

  // Doc kinds
  kind_contract: { hr: "Ugovor o izradi", en: "Service agreement" },
  kind_offer_simple: { hr: "Jednostavna ponuda", en: "Simple offer" },
  kind_offer_detailed: { hr: "Detaljna ponuda", en: "Detailed offer" },
  kind_contract_desc: {
    hr: "Standardni ugovor o izradi web stranice / aplikacije / dizajna / održavanja.",
    en: "Standard service agreement for development, design or maintenance projects.",
  },
  kind_offer_simple_desc: {
    hr: "Brza ponuda po stavkama (item, qty, price, total) — kao za poznate projekte.",
    en: "Quick line-item estimate (item, qty, price, total) — for scoped work.",
  },
  kind_offer_detailed_desc: {
    hr: "Opširna ponuda sa specifikacijom, fazama, exact i ballpark procjenama.",
    en: "Comprehensive offer with specification, phases, exact and ballpark estimates.",
  },

  // Common UI
  next_number: { hr: "Sljedeći broj", en: "Next number" },
  number: { hr: "Broj", en: "Number" },
  language: { hr: "Jezik", en: "Language" },
  back: { hr: "Natrag", en: "Back" },
  download_pdf: { hr: "Preuzmi PDF", en: "Download PDF" },
  download_word: { hr: "Preuzmi Word", en: "Download Word" },
  open_print: { hr: "Otvoren print dialog — odaberi 'Save as PDF'", en: "Print dialog opened — choose 'Save as PDF'" },
  word_downloaded: { hr: "Word dokument preuzet", en: "Word document downloaded" },
  saved_to_drive: { hr: "Spremljeno na Google Drive", en: "Saved to Google Drive" },
  drive_failed: { hr: "Drive upload nije uspio", en: "Drive upload failed" },
  page_of: { hr: "Stranica", en: "Page" },
  page: { hr: "Stranica", en: "Page" },

  // Client
  client: { hr: "Klijent", en: "Client" },
  client_name: { hr: "Naziv klijenta", en: "Client name" },
  client_address: { hr: "Adresa", en: "Address" },
  client_city: { hr: "Grad", en: "City" },
  client_country: { hr: "Država", en: "Country" },
  client_oib: { hr: "OIB", en: "OIB" },
  client_vat_id: { hr: "VAT ID", en: "VAT ID" },

  // Simple offer
  estimate_number: { hr: "Broj ponude", en: "Estimate number" },
  payment_method: { hr: "Način plaćanja", en: "Payment method" },
  date_of_issue: { hr: "Datum izdavanja", en: "Date of issue" },
  wire_transfer: { hr: "Bezgotovinska uplata", en: "Wire transfer" },
  item: { hr: "Stavka", en: "Item" },
  description: { hr: "Opis", en: "Description" },
  currency: { hr: "Valuta", en: "Currency" },
  price: { hr: "Cijena", en: "Price" },
  qty: { hr: "Kol.", en: "Qty" },
  unit: { hr: "Jed.", en: "Unit" },
  total: { hr: "Ukupno", en: "Total" },
  vat: { hr: "PDV", en: "VAT" },
  subtotal: { hr: "Međuzbroj", en: "Subtotal" },
  add_item: { hr: "Dodaj stavku", en: "Add item" },
  remove: { hr: "Ukloni", en: "Remove" },
  payment_information: { hr: "Podaci za plaćanje", en: "Payment information" },
  iban: { hr: "IBAN", en: "IBAN" },
  swift: { hr: "SWIFT", en: "SWIFT" },
  payment_note: { hr: "Poziv na broj", en: "Payment note" },
  reference_number: { hr: "Referenca", en: "Reference number" },
  note: { hr: "Napomena", en: "Note" },
  default_note: {
    hr: "Ponuda nije obvezujuća i ne može se koristiti za poreznu odbitu.",
    en: "The estimate is non-binding and it can't be used for tax deduction purposes.",
  },
  hour: { hr: "sat", en: "hour" },
  hours: { hr: "sati", en: "hours" },
  day: { hr: "dan", en: "day" },
  days: { hr: "dana", en: "days" },
  piece: { hr: "kom", en: "pcs" },

  // Detailed offer
  project_name: { hr: "Naziv projekta", en: "Project name" },
  project_number: { hr: "Broj projekta", en: "Project number" },
  contents: { hr: "Sadržaj", en: "Contents" },
  specification: { hr: "Specifikacija", en: "Specification" },
  intro: { hr: "Uvod", en: "Introduction" },
  features: { hr: "Funkcionalnosti", en: "Features" },
  technical_implementation: { hr: "Tehnička implementacija", en: "Technical implementation" },
  phases: { hr: "Faze projekta", en: "Project phases" },
  phase: { hr: "Faza", en: "Phase" },
  ux_ui: { hr: "UX/UI dizajn", en: "UX/UI design" },
  development: { hr: "Razvoj", en: "Development" },
  qa: { hr: "Testiranje (QA)", en: "Testing (QA)" },
  pm: { hr: "Upravljanje projektom (PM)", en: "Project management (PM)" },
  pricing_estimate: { hr: "Cjenovna procjena", en: "Pricing estimate" },
  exact_estimates: { hr: "Točne procjene (Exact estimates)", en: "Exact estimates" },
  ballpark_estimates: { hr: "Okvirne procjene (Ballpark estimates)", en: "Ballpark estimates" },
  delivery: { hr: "Rok isporuke", en: "Delivery dates" },
  payment_milestones: { hr: "Dinamika plaćanja", en: "Payment milestones" },
  percent: { hr: "Postotak", en: "Percent" },
  amount: { hr: "Iznos", en: "Amount" },
  vat_excluded: { hr: "+ PDV", en: "+ VAT" },
  vat_if_applicable: { hr: "+ PDV (ako je primjenjivo)", en: "+ VAT (if applicable)" },

  // Contract (kept Croatian, but allow English)
  partner: { hr: "Naručitelj", en: "Client" },
  contractor: { hr: "Izvođač", en: "Contractor" },
};

export function t(key: keyof typeof DICT, lang: Lang): string {
  return DICT[key]?.[lang] ?? key;
}

export function formatDate(iso: string | undefined, lang: Lang): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(lang === "hr" ? "hr-HR" : "en-GB");
}

export function formatMoney(value: number, currency = "EUR", lang: Lang = "hr"): string {
  const formatted = new Intl.NumberFormat(lang === "hr" ? "hr-HR" : "en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  return `${formatted} ${currency === "EUR" ? "€" : currency}`;
}
