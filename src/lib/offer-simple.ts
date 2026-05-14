import { t, type Lang } from "./i18n";

export interface SimpleOfferLine {
  id: string;
  item: string;
  currency: string;
  price: number;
  qty: number;
  unit: string;
  vatRate: number; // percent, 0 means none
}

export interface SimpleOfferData {
  lang: Lang;
  number: string;
  date: string; // YYYY-MM-DD
  paymentMethod: string;
  client: {
    name: string;
    address: string;
    city: string;
    country: string;
    vatId: string;
  };
  lines: SimpleOfferLine[];
  payment: {
    iban: string;
    swift: string;
    note: string;
    reference: string;
  };
  note: string;
}

export const emptySimpleOffer = (lang: Lang): SimpleOfferData => ({
  lang,
  number: "",
  date: new Date().toISOString().slice(0, 10),
  paymentMethod: t("wire_transfer", lang),
  client: { name: "", address: "", city: "", country: "", vatId: "" },
  lines: [
    {
      id: crypto.randomUUID(),
      item: "",
      currency: "EUR",
      price: 0,
      qty: 1,
      unit: t("hour", lang),
      vatRate: 0,
    },
  ],
  payment: {
    iban: "HR4525000091101577810",
    swift: "HAABHR22XXX",
    note: "",
    reference: "",
  },
  note: t("default_note", lang),
});

export function lineTotal(line: SimpleOfferLine): number {
  return line.price * line.qty;
}

export function offerTotals(data: SimpleOfferData) {
  const subtotal = data.lines.reduce((sum, l) => sum + lineTotal(l), 0);
  const vat = data.lines.reduce(
    (sum, l) => sum + lineTotal(l) * (l.vatRate / 100),
    0,
  );
  return { subtotal, vat, total: subtotal + vat };
}
