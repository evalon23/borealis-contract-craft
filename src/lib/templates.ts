export type TemplateId = "wordpress" | "webapp" | "design" | "maintenance";

export interface ContractTemplate {
  id: TemplateId;
  title: string;
  description: string;
  accent: "red" | "blue" | "purple" | "teal";
  body: string;
}

/**
 * Template bodies use {{VARIABLE}} placeholders for dynamic fields.
 * All surrounding static text matches the Borealis reference contract exactly.
 */
const buildBody = (
  titleUpper: string,
  subjectArticle: string,
  servicesArticle: string,
) => `**{{PARTNER_NAME}}** iz {{PARTNER_CITY}}, {{PARTNER_ADDRESS}}, OIB: {{PARTNER_OIB}}, kojeg zastupa {{PARTNER_REP_TITLE}} {{PARTNER_REP}} (u daljnjem tekstu: „Naručitelj")

i

**Borealis d.o.o.** iz Zagreba, Ljutomerska 7, OIB: 69433981874, kojeg zastupa direktor {{BOREALIS_REP}} (u daljnjem tekstu: „Izvođač"),

sklopili su u Zagrebu, dana {{SIGN_DATE}}. godine sljedeći

## ${titleUpper}

## PREDMET UGOVORA

### Članak 1.

${subjectArticle}

### Članak 2.

2.1. Sukladno odredbama prethodnog članka, Naručitelj ovim ugovorom povjerava Izvođaču, a Izvođač preuzima radove iz Članka 1. ovog ugovora.

2.2. Izvođač se obvezuje radove izvršavati prema pravilima struke i važećim tehničkim propisima i normativima, drugim obveznim standardima važećim u Republici Hrvatskoj, te posebnim uputama Naručitelja. Ugovorne stranke suglasno utvrđuju da opis radova iz ovog Ugovora obuhvaća izvedbu radova do njihove besprijekorne funkcionalnosti i uporabljivosti, što stranke ugovaraju kao bitan sastojak ovog Ugovora.

${servicesArticle}

2.4. Izvođač će za navedene usluge izdvojiti godišnji budžet u iznosu od **{{BUDGET_EUR}} EUR** bez PDV-a, što odgovara fondu od {{BUDGET_HOURS}} radnih sati godišnje.

2.5. Budžet iz stavke 2.4. troši se prema obračunu napravljenih radnih sati od strane Izvođača na temelju sljedećih cijena:
- {{HOURLY_RATE_REGULAR}} EUR po satu za rad u redovnom radnom vremenu (pon-pet od 08:00 do 17:00, osim blagdana i praznika),
- {{HOURLY_RATE_OVERTIME}} EUR po satu za rad izvan redovnog radnog vremena.

2.6. U slučaju da se godišnji budžet u potpunosti iskoristi, a Naručitelj zatraži daljnje usluge, svi dodatno utrošeni sati obračunavat će se i naplaćivati prema redovnoj satnici od {{HOURLY_RATE_REGULAR}} EUR po satu iz stavke 2.5., na temelju prethodnog dogovora i specifikacije radova.

2.7. Izvođač se obvezuje svaki mjesec dostaviti detaljnu specifikaciju izvršenih usluga i utrošenih sati za prethodni mjesec, te trenutno stanje budžeta.

2.8. Neiskorišteni sati iz godišnjeg budžeta iz stavke 2.4. prenose se u sljedeće godine bez ograničenja, sve dok traje poslovna suradnja, te ostaju na raspolaganju Naručitelju za kasnije korištenje.

2.9. Uvjeti plaćanja: {{PAYMENT_TERMS}}

2.10. Datum početka izvršavanja obveza: {{START_DATE}}. Rok isporuke: {{DEADLINE}}.

## AUTORSKA I DRUGA PRAVA

### Članak 3.

3.1. Izvorni kod predmeta iz Članka 1. te svi podaci vezani uz predmet su autorsko djelo i isključivo vlasništvo Naručitelja. Naručitelj je ovlašten prenijeti sva prava iz ovog Ugovora na bilo koju pravnu ili fizičku osobu, bez ikakve dodatne suglasnosti Izvođača. Radi izbjegavanja svake dvojbe, Izvođač ovim putem unaprijed daje Naručitelju pravo na takav prijenos.

## ČUVANJE POSLOVNE TAJNE

### Članak 4.

4.1. Svaka se Ugovorna strana obvezuje da će čuvati i neće otkrivati trećim osobama, bez prethodne izričite pisane suglasnosti druge Ugovorne strane bilo koje i sve informacije u svezi sadržaja odredbi ovog ugovora, kao i odgovarajućih prethodnih, istodobnih ili kasnijih rasprava i pregovora u svezi sklapanja, obnavljanja ili prestanka istog, bez obzira na način i oblik komunikacije – pisani, elektronički ili usmeni, uključujući, bez ograničenja:

- 4.1.1. Informacije koje je Ugovorna strana koja ih priopćuje označila kao povjerljive i/ili tajne;
- 4.1.2. Informacije koje se, s obzirom na okolnosti njihova otkrivanja, odnosno priopćavanja, trebaju u dobroj vjeri tretirati kao povjerljive i/ili tajne;
- 4.1.3. Sadržaj pregovora ili rasprava između Ugovornih strana; te
- 4.1.4. Sve prijedloge odredbi i uvjeta ovog ugovora, kao i njihov konačno usuglašeni tekst.

4.2. Bilo koje i sve informacije određene u članku 4.1. ovog ugovora u daljnjem tekstu: Povjerljive informacije.

4.3. Svaka se Ugovorna strana obvezuje da će:

- 4.3.1. Poduzeti razumne mjere radi zaštite Povjerljivih informacija druge Ugovorne strane koje će osigurati razinu zaštite koja je barem ista kao za vlastite povjerljive informacije;
- 4.3.2. Odmah obavijestiti Ugovornu stranu koja je priopćila Povjerljive informacije o saznanjima o neovlaštenom korištenju ili otkrivanju Povjerljivih informacija; te
- 4.3.3. Surađivati s Ugovornom stranom koja je priopćila Povjerljive informacije kako bi pomogla povratiti nadzor nad Povjerljivim informacijama i spriječiti njihovo daljnje neovlašteno korištenje ili otkrivanje.

4.4. Svaka je Ugovorna strana ovlaštena otkriti Povjerljive informacije druge Ugovorne strane svojim zaposlenicima, zastupnicima, organizacijskim jedinicama, povezanim društvima, stjecateljima licence ili ugovarateljima (u daljnjem tekstu svaki zasebno ili svi zajedno, ovisno o kontekstu: Predstavnici), koji mogu dalje otkriti Povjerljive informacije drugim Predstavnicima, samo ako odgovarajući Predstavnici moraju znati Povjerljive informacije radi ostvarivanja poslovne suradnje između Ugovornih strana. Prije otkrivanja Povjerljivih informacija Predstavnicima, svaka se Ugovorna strana obvezuje pobrinuti da se Predstavnici obvežu čuvati Povjerljive informacije na način koji je sukladan obvezi čuvanja poslovne tajne kako je određena u stavku 4.1. ovog Članka sklapanjem s Predstavnicima odgovarajućih ugovora o čuvanju poslovne tajne ili na neki drugi prikladan način.

4.5. Svaka je Ugovorna strana ovlaštena otkriti Povjerljive informacije druge Ugovorne strane na temelju pravomoćne odluke nadležnog suda odnosno konačne odluke nadležnog upravnog tijela. Prije toga, svaka se Ugovorna strana obvezuje osigurati najveći mogući stupanj zaštite Povjerljivih informacija i, kada je to moguće, unaprijed obavijestiti Ugovornu stranu čije se Povjerljive informacije moraju otkriti kako bi joj se pružila razumna mogućnost da poduzme zaštitne mjere.

4.6. Osim u dopuštenim slučajevima određenim u stavkama 4.4. i 4.5. ovog Ugovora, svaka se Ugovorna strana obvezuje da neće koristiti ili otkrivati Povjerljive informacije druge Ugovorne strane za vrijeme važenja ugovora i tri godine po njegovu prestanku. Ako je prema važećim pravnim propisima predviđen duži rok čuvanja poslovne tajne, primjenjivat će se rok određen u odgovarajućem pravnom propisu.

4.7. Ugovorne strane su suglasne da naknada štete može biti neprimjerena naknada zbog povrede obveze čuvanja poslovne tajne iz ovog Ugovora. Ugovorne strane su sporazumne da su ovlaštene zahtijevati privremenu zaštitu putem pravnih sredstava dopuštenih prema važećim pravnim propisima kako bi se spriječilo otkrivanje Povjerljivih informacija protivno odredbama Članka 4. ovog Ugovora.

## RASKID UGOVORA

### Članak 5.

5.1. U slučaju da Izvođač ne započne radove u ugovorenom roku ili radovi ne bi napredovali kako je ovim Ugovorom predviđeno, kao i u slučaju ako Izvođač ne obavlja radove kvalitetno, Naručitelj će ostaviti Izvođaču dodatni rok za ispunjenje ugovornih obveza. Ukoliko niti po proteku dodatnog roka Izvođač ne ispuni svoje ugovorne obveze, Naručitelj je ovlašten jednostrano, bez daljnjeg dodatnog roka za ispunjenje raskinuti ovaj Ugovor, te radove ili dio radova povjeriti nekom drugom Izvođaču.

5.2. Ovaj ugovor i svi njegovi uvjeti vrijede do njegovog raskida. Naručitelj može otkazati ovaj ugovor u bilo kojem trenutku uz prethodnu pismenu najavu Izvođaču i to minimalno 30 dana prije otkaza ugovora bez navođenja posebnog razloga.

5.3. Kada dođe do otkazivanja ugovora prema Članku 5.2. bilo istekom datuma do kojeg vrijedi ugovor ili ranijim otkazivanjem od strane naručitelja, a postoje prethodno akumulirani neiskorišteni sati održavanja, Naručitelj ih i dalje ima pravo iskoristiti bez dodatnih troškova. Izvođač i Naručitelj će se pismenim putem dogovoriti u kojem periodu i na koji način će akumulirani sati biti iskorišteni ukoliko dođe do ovog slučaja.

## RJEŠAVANJE SPOROVA

### Članak 6.

6.1. Sve sporove koji proizlaze iz ovog Ugovora, uključujući i sporove koji se odnose na pitanja njegovog valjanog nastanka, povrede ili prestanka, kao i na sve pravne učinke koji iz toga proistječu, ugovorne strane će pokušati riješiti u mirnom putu, a u slučaju da u tome ne uspiju, ugovaraju nadležnost stvarno nadležnog suda u Zagrebu.

6.2. Sve izmjene i dopune ovog Ugovora vrijede samo ako su sastavljene u pisanom obliku i potpisane od ugovornih strana. To vrijedi i za dogovor kojim se ukida potreba pisanog oblika.

## ZAVRŠNE ODREDBE

### Članak 7.

7.1. Ovaj ugovor napravljen je u 4 (četiri) istovjetna primjerka, po 2 (dva) za svaku od ugovornih strana.

7.2. Ugovornim stranama je ovaj ugovor pročitan, protumačen, te ga one u znak prihvaćanja svih prava i obveza njime stipuliranih vlastoručno potpisuju.

U Zagrebu, dana {{SIGN_DATE}}. godine.


NARUČITELJ:                                                  IZVOĐAČ:


___________________________                                  ___________________________
{{PARTNER_REP}}, {{PARTNER_REP_TITLE}}                       {{BOREALIS_REP}}, Direktor
`;

// Per-template Article 1 (subject) and Article 2.3 (services) — everything else is shared.
const WORDPRESS_SUBJECT = `1.1. Predmet ovog ugovora je izrada WordPress web stranice pod nazivom "{{PROJECT_NAME}}".

{{PROJECT_SCOPE}}`;

const WORDPRESS_SERVICES = `2.3. Izvođač se obvezuje pružiti sljedeće usluge vezane uz izradu WordPress web stranice koje uključuju, ali nisu ograničene na:

{{SERVICE_LIST}}`;

const WEBAPP_SUBJECT = `1.1. Predmet ovog ugovora je izrada web aplikacije pod nazivom "{{PROJECT_NAME}}".

{{PROJECT_SCOPE}}`;

const WEBAPP_SERVICES = `2.3. Izvođač se obvezuje pružiti sljedeće usluge vezane uz razvoj web aplikacije koje uključuju, ali nisu ograničene na:

{{SERVICE_LIST}}`;

const DESIGN_SUBJECT = `1.1. Predmet ovog ugovora je dizajn i razvoj digitalnog proizvoda pod nazivom "{{PROJECT_NAME}}".

{{PROJECT_SCOPE}}`;

const DESIGN_SERVICES = `2.3. Izvođač se obvezuje pružiti sljedeće usluge dizajna i razvoja koje uključuju, ali nisu ograničene na:

{{SERVICE_LIST}}`;

const MAINTENANCE_SUBJECT = `1.1. Izvođač se obvezuje vršiti održavanje i podršku za predmet iz ovog ugovora pod nazivom "{{PROJECT_NAME}}".

{{PROJECT_SCOPE}}`;

const MAINTENANCE_SERVICES = `2.3. Izvođač se obvezuje vršiti usluge održavanja i podrške za predmet iz Članka 1. ovog ugovora koje uključuju, ali nisu ograničene na sljedeće aktivnosti:

{{SERVICE_LIST}}`;

export const TEMPLATES: ContractTemplate[] = [
  {
    id: "wordpress",
    title: "Ugovor o izradi WordPress stranice",
    description:
      "Ugovor za izradu WordPress web stranice uključujući dizajn, razvoj i isporuku.",
    accent: "red",
    body: buildBody(
      "UGOVOR O IZRADI WORDPRESS WEB STRANICE",
      WORDPRESS_SUBJECT,
      WORDPRESS_SERVICES,
    ),
  },
  {
    id: "webapp",
    title: "Ugovor o izradi web aplikacije",
    description:
      "Ugovor za razvoj prilagođene web aplikacije s back-end i front-end komponentama.",
    accent: "blue",
    body: buildBody(
      "UGOVOR O IZRADI WEB APLIKACIJE",
      WEBAPP_SUBJECT,
      WEBAPP_SERVICES,
    ),
  },
  {
    id: "design",
    title: "Ugovor o dizajnu i razvoju",
    description:
      "Ugovor koji obuhvaća dizajn i razvoj digitalnih proizvoda i rješenja.",
    accent: "purple",
    body: buildBody(
      "UGOVOR O DIZAJNU I RAZVOJU",
      DESIGN_SUBJECT,
      DESIGN_SERVICES,
    ),
  },
  {
    id: "maintenance",
    title: "Ugovor o održavanju i podršci",
    description:
      "Ugovor o kontinuiranom održavanju, podršci i nadogradnjama postojećih rješenja.",
    accent: "teal",
    body: buildBody(
      "UGOVOR O ODRŽAVANJU I PODRŠCI",
      MAINTENANCE_SUBJECT,
      MAINTENANCE_SERVICES,
    ),
  },
];

export const getTemplate = (id: TemplateId) =>
  TEMPLATES.find((t) => t.id === id)!;
