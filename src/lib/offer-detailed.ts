import type { Lang } from "./i18n";

export interface PhaseHourRow {
  id: string;
  label: string;
  hours: number;
}

export interface ExactEstimateRow {
  id: string;
  phase: string;
  hours: number;
  price: number;
}

export interface BallparkEstimateRow {
  id: string;
  phase: string;
  hours: string; // free text e.g. "—" or "100-200"
  priceMin: number;
  priceMax: number;
}

export interface MilestoneRow {
  id: string;
  label: string;
  percent: number;
  amount: number;
}

export interface DetailedOfferData {
  lang: Lang;
  number: string;
  date: string;
  projectName: string;
  client: {
    name: string;
    address: string;
    city: string;
    country: string;
    vatId: string;
  };
  /** Rich text HTML — intro paragraph(s) + bullet lists. */
  specification: string;
  technicalImplementation: string;
  designHours: PhaseHourRow[];
  developmentHours: PhaseHourRow[];
  exactEstimates: ExactEstimateRow[];
  ballparkEstimates: BallparkEstimateRow[];
  hourlyRate: number;
  delivery: string;
  milestones: MilestoneRow[];
  notes: string;
}

export const emptyDetailedOffer = (lang: Lang): DetailedOfferData => ({
  lang,
  number: "",
  date: new Date().toISOString().slice(0, 10),
  projectName: "",
  client: { name: "", address: "", city: "", country: "", vatId: "" },
  specification: "",
  technicalImplementation: "",
  designHours: [
    { id: crypto.randomUUID(), label: lang === "hr" ? "UX/UI dizajn" : "UX/UI design", hours: 0 },
    { id: crypto.randomUUID(), label: lang === "hr" ? "Revizije i dorade" : "Revisions", hours: 0 },
  ],
  developmentHours: [
    { id: crypto.randomUUID(), label: lang === "hr" ? "Razvoj aplikacije" : "Application development", hours: 0 },
    { id: crypto.randomUUID(), label: lang === "hr" ? "Testiranje (QA)" : "Testing (QA)", hours: 0 },
    { id: crypto.randomUUID(), label: lang === "hr" ? "Upravljanje projektom (PM)" : "Project management (PM)", hours: 0 },
  ],
  exactEstimates: [
    { id: crypto.randomUUID(), phase: lang === "hr" ? "UX/UI dizajn" : "UX/UI design", hours: 0, price: 0 },
  ],
  ballparkEstimates: [],
  hourlyRate: 50,
  delivery: "",
  milestones: [
    { id: crypto.randomUUID(), label: lang === "hr" ? "Po dovršetku" : "On completion", percent: 100, amount: 0 },
  ],
  notes: "",
});

export const sumHours = (rows: PhaseHourRow[]) =>
  rows.reduce((s, r) => s + (Number(r.hours) || 0), 0);

export const sumExact = (rows: ExactEstimateRow[]) => ({
  hours: rows.reduce((s, r) => s + (Number(r.hours) || 0), 0),
  price: rows.reduce((s, r) => s + (Number(r.price) || 0), 0),
});

export const sumBallpark = (rows: BallparkEstimateRow[]) => ({
  min: rows.reduce((s, r) => s + (Number(r.priceMin) || 0), 0),
  max: rows.reduce((s, r) => s + (Number(r.priceMax) || 0), 0),
});
