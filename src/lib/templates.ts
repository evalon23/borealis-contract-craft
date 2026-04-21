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
const PLACEHOLDER_BODY = (title: string) => `**{{PARTNER_NAME}}** iz {{PARTNER_CITY}}, {{PARTNER_ADDRESS}}, OIB: {{PARTNER_OIB}}, kojeg zastupa {{PARTNER_REP_TITLE}} {{PARTNER_REP}} (u daljnjem tekstu: „Naručitelj")

i

**Borealis d.o.o.** iz Zagreba, Ljutomerska 7, OIB: 69433981874, kojeg zastupa direktor {{BOREALIS_REP}} (u daljnjem tekstu: „Izvođač"),

sklopili su u Zagrebu, dana {{SIGN_DATE}}. godine sljedeći

## ${title.toUpperCase()}

## PREDMET UGOVORA

### Članak 1.

1.1. Predmet ovog ugovora je projekt pod nazivom "{{PROJECT_NAME}}".

{{PROJECT_SCOPE}}

### Članak 2.

2.1. Izvođač se obvezuje pružiti sljedeće usluge:

{{SERVICE_LIST}}

2.2. Ukupna vrijednost ugovora iznosi **{{CONTRACT_VALUE}} EUR** bez PDV-a. Godišnji budžet iznosi {{BUDGET_EUR}} EUR, što odgovara fondu od {{BUDGET_HOURS}} radnih sati godišnje.

2.3. Budžet se troši prema obračunu napravljenih radnih sati na temelju sljedećih cijena:
- {{HOURLY_RATE_REGULAR}} EUR po satu za rad u redovnom radnom vremenu (pon-pet od 08:00 do 17:00, osim blagdana i praznika),
- {{HOURLY_RATE_OVERTIME}} EUR po satu za rad izvan redovnog radnog vremena.

2.4. Uvjeti plaćanja: {{PAYMENT_TERMS}}

### Članak 3.

3.1. Datum početka izvršavanja obveza: {{START_DATE}}. Rok isporuke: {{DEADLINE}}.

## POSEBNI UVJETI

### Članak 4.

4.1. {{SPECIAL_CONDITIONS}}

## ZAVRŠNE ODREDBE

### Članak 5.

5.1. Ovaj ugovor napravljen je u 4 (četiri) istovjetna primjerka, po 2 (dva) za svaku od ugovornih strana.

5.2. Ugovornim stranama je ovaj ugovor pročitan, protumačen, te ga one u znak prihvaćanja svih prava i obveza njime stipuliranih vlastoručno potpisuju.

U Zagrebu, dana {{SIGN_DATE}}. godine.


NARUČITELJ:                                                  IZVOĐAČ:


___________________________                                  ___________________________
{{PARTNER_REP}}, {{PARTNER_REP_TITLE}}                       {{BOREALIS_REP}}, Direktor
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
