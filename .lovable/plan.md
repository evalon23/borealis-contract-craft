## Cilj

Pretvoriti aplikaciju iz "Generator ugovora" u **Paperline** — alat s tri vrste dokumenata, dvojezično (HR/EN), s istim Word/PDF/Drive izlazima.

## Što se mijenja

### 1. Brand & Header
- Naziv aplikacije: **Paperline** (zamijeniti "Generator ugovora" svuda)
- Header: logo + "Paperline" naziv + nav (Predlošci, Povijest)

### 2. Početna stranica (3 kartice umjesto 4)
- **Ugovor o izradi** (jedan, parametriziran — bira se vrsta projekta unutar forme)
- **Jednostavna ponuda** (Simple offer) — kao Linde primjer: zaglavlje klijenta + line-itemi (br., opis, cijena, qty, jedinica, total, VAT) + IBAN/uplata + napomena
- **Detaljna ponuda** (Detailed offer) — kao Tokić primjer: specifikacija (rich text), faze projekta s tablicom sati, exact + ballpark estimates, rok isporuke, payment milestones

### 3. Jezik HR/EN — toggle prilikom izrade
- Toggle (HR/EN) u headeru forme
- Sve fiksne fraze u predlošcima i izlazima prevedene (Predmet ugovora ↔ Subject of agreement, Ukupno ↔ Total, itd.)
- Datumi se formatiraju prema jeziku

### 4. Numeracija: N-YY
- Format `9-26`, `44-25` (auto-increment unutar tekuće godine, dvoznamenkasta godina)
- Jedan brojač zajednički za sve tipove dokumenata (zadržava jednostavnost; ako kasnije zatreba split, lako se doda)
- Reset svake nove godine

### 5. Predlošci

**Jednostavna ponuda — sekcije:**
- Klijent (naziv, adresa, država, VAT ID)
- Estimate Number / Broj ponude (auto)
- Payment method, Date of issue
- Tablica stavki (dodaj/ukloni redove): #, Item, Currency, Price, Qty, Unit, Total, VAT
- Subtotal / VAT / Total (auto)
- Payment information: IBAN, SWIFT, Payment note, Reference number
- Note (slobodan tekst)
- Footer: Borealis pravne info (već postoji)

**Detaljna ponuda — sekcije:**
- Klijent
- Project name + project number
- Date
- Sadržaj (auto generiran iz sekcija)
- Specifikacija (rich text — uvod + bullet-lista funkcionalnosti)
- Faze projekta (rich text po fazi)
- Tablica: UX/UI dizajn — sati
- Tablica: Razvoj — sati po podfazi (Razvoj, QA, PM)
- Cjenovna procjena: Exact estimates tablica (faza, sati, cijena)
- Ballpark estimates tablica (faza, sati, cijena raspon)
- Rok isporuke (slobodan tekst)
- Payment milestones tablica (faza, %, iznos)

### 6. Izlazi (Word + PDF + Drive)
- Postojeći mehanizam ostaje (print-to-PDF + .docx + Google Drive upload)
- Footer i header jednaki za sve dokumente
- Filename: `{number}_{client-slug}_{tip}_{lang}.{ext}`

## Tehnički plan

```
src/lib/
  branding.ts                  → zamijeniti footer copy + naziv app na "Paperline"
  contract.ts → docs.ts        → preimenovati i proširiti na 3 tipa
  templates.ts                 → contract templates (HR + EN)
  offer-simple.ts (novo)       → simple offer model + builder
  offer-detailed.ts (novo)     → detailed offer model + builder
  i18n.ts (novo)               → fiksne fraze HR/EN
  numbering.ts (novo)          → N-YY counter (zajedno s contract counter)
  export.ts                    → prošireno za 3 tipa (ContractPayload | SimpleOfferPayload | DetailedOfferPayload)

src/components/
  Header.tsx                   → "Paperline" naziv
  ContractForm.tsx             → ostaje, prilagodi labelama
  ContractPreview.tsx          → ostaje za ugovor
  SimpleOfferForm.tsx (novo)
  SimpleOfferPreview.tsx (novo)
  DetailedOfferForm.tsx (novo)
  DetailedOfferPreview.tsx (novo)
  LanguageToggle.tsx (novo)

src/routes/
  index.tsx                    → 3 kartice, naziv "Paperline"
  predlozak.$id.tsx → dokument.$kind.tsx (novi router) ili zadržati i dodati nove rute:
    ponuda-jednostavna.tsx (+ optional ?edit=)
    ponuda-detaljna.tsx
  povijest.tsx                 → tabela prikazuje sve tipove (s kolonom "Tip")
```

## Što ostaje isto
- Google Drive upload pipeline (`drive.functions.ts`)
- Print-to-PDF flow
- Docx builder helpers (HTML parsing, signature table — koristi se samo za ugovor)
- shadcn UI, dizajn tokeni

## Što NE radim u ovom koraku (ako je previše)
- Cloud bazu (i dalje localStorage za povijest)
- Logiku autorizacije / rola
- Per-tip odvojene brojače (ostaje jedan)
- Custom logo upload (ostaje hardkodirani Borealis)
- Layout dizajn detaljne ponude 1:1 s Tokić primjerom (radim funkcionalno blizak, ne piksel-perfektan klon)

Plan je opsežan — potvrdi pa krećem.