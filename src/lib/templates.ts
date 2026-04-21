export type TemplateId = "wordpress" | "webapp" | "design" | "maintenance";

export interface ContractTemplate {
  id: TemplateId;
  title: string;
  description: string;
  accent: "red" | "blue" | "purple" | "teal";
  body: string;
}

/**
 * Template bodies use {{VARIABLE}} placeholders.
 * Replace the PLACEHOLDER_BODY strings below with the real Croatian contract texts.
 */
const PLACEHOLDER_BODY = (title: string) => `PREDMET UGOVORA
Ovaj ugovor sklapa se između:

IZVRŠITELJA:
Borealis d.o.o., Ljutomerska ulica 7, 10 000 Zagreb
OIB: 69433981874
zastupan po: {{BOREALIS_REP}}

i

NARUČITELJA:
{{PARTNER_NAME}}, {{PARTNER_ADDRESS}}, {{PARTNER_CITY}}
OIB: {{PARTNER_OIB}}
zastupan po: {{PARTNER_REP}}, {{PARTNER_REP_TITLE}}

Članak 1. – Predmet ugovora
Predmet ovog ugovora je ${title.toLowerCase()} pod nazivom "{{PROJECT_NAME}}".

Opis predmeta ugovora:
{{PROJECT_SCOPE}}

Članak 2. – Usluge
Izvršitelj se obvezuje pružiti sljedeće usluge:
{{SERVICE_LIST}}

Članak 3. – Financijski uvjeti
Ukupna vrijednost ugovora iznosi {{CONTRACT_VALUE}} EUR.
Godišnji budžet: {{BUDGET_EUR}} EUR.
Godišnji broj sati: {{BUDGET_HOURS}} sati.
Satnica u redovnom radnom vremenu: {{HOURLY_RATE_REGULAR}} EUR/h.
Satnica izvan radnog vremena: {{HOURLY_RATE_OVERTIME}} EUR/h.

Uvjeti plaćanja:
{{PAYMENT_TERMS}}

Članak 4. – Rokovi
Datum početka: {{START_DATE}}
Rok isporuke: {{DEADLINE}}

Članak 5. – Posebni uvjeti
{{SPECIAL_CONDITIONS}}

Članak 6. – Završne odredbe
Ugovor je sastavljen u dva (2) istovjetna primjerka, po jedan za svaku ugovornu stranu.

U Zagrebu, {{SIGN_DATE}}

Za Izvršitelja:                                Za Naručitelja:
_______________________                        _______________________
{{BOREALIS_REP}}                               {{PARTNER_REP}}
Borealis d.o.o.                                {{PARTNER_NAME}}
`;

export const TEMPLATES: ContractTemplate[] = [
  {
    id: "wordpress",
    title: "Ugovor o izradi WordPress stranice",
    description:
      "Ugovor za izradu WordPress web stranice uključujući dizajn, razvoj i isporuku.",
    accent: "red",
    body: PLACEHOLDER_BODY("ugovor o izradi WordPress web stranice"),
  },
  {
    id: "webapp",
    title: "Ugovor o izradi web aplikacije",
    description:
      "Ugovor za razvoj prilagođene web aplikacije s back-end i front-end komponentama.",
    accent: "blue",
    body: PLACEHOLDER_BODY("ugovor o izradi web aplikacije"),
  },
  {
    id: "design",
    title: "Ugovor o dizajnu i razvoju",
    description:
      "Ugovor koji obuhvaća dizajn i razvoj digitalnih proizvoda i rješenja.",
    accent: "purple",
    body: PLACEHOLDER_BODY("ugovor o dizajnu i razvoju"),
  },
  {
    id: "maintenance",
    title: "Ugovor o održavanju i podršci",
    description:
      "Ugovor o kontinuiranom održavanju, podršci i nadogradnjama postojećih rješenja.",
    accent: "teal",
    body: PLACEHOLDER_BODY("ugovor o održavanju i podršci"),
  },
];

export const getTemplate = (id: TemplateId) =>
  TEMPLATES.find((t) => t.id === id)!;
