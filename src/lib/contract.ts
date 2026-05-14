import type { TemplateId } from "./templates";
import type { Lang } from "./i18n";

export type DocKind = "contract" | "offer-simple" | "offer-detailed";

export type ContractVars = {
  PARTNER_NAME: string;
  PARTNER_CITY: string;
  PARTNER_ADDRESS: string;
  PARTNER_OIB: string;
  PARTNER_REP: string;
  PARTNER_REP_TITLE: string;
  PROJECT_NAME: string;
  PROJECT_SCOPE: string;
  SERVICE_LIST: string;
  CONTRACT_VALUE: string;
  BUDGET_EUR: string;
  BUDGET_HOURS: string;
  HOURLY_RATE_REGULAR: string;
  HOURLY_RATE_OVERTIME: string;
  PAYMENT_TERMS: string;
  START_DATE: string;
  DEADLINE: string;
  SPECIAL_CONDITIONS: string;
  SIGN_DATE: string;
  BOREALIS_REP: string;
};

export const EMPTY_VARS: ContractVars = {
  PARTNER_NAME: "",
  PARTNER_CITY: "",
  PARTNER_ADDRESS: "",
  PARTNER_OIB: "",
  PARTNER_REP: "",
  PARTNER_REP_TITLE: "",
  PROJECT_NAME: "",
  PROJECT_SCOPE: "",
  SERVICE_LIST: "",
  CONTRACT_VALUE: "",
  BUDGET_EUR: "",
  BUDGET_HOURS: "",
  HOURLY_RATE_REGULAR: "",
  HOURLY_RATE_OVERTIME: "",
  PAYMENT_TERMS: "",
  START_DATE: "",
  DEADLINE: "",
  SPECIAL_CONDITIONS: "",
  SIGN_DATE: "",
  BOREALIS_REP: "Dennis Puzak",
};

export function fillTemplate(body: string, vars: ContractVars): string {
  return body.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const v = (vars as Record<string, string>)[key];
    return v ?? "";
  });
}

// ===== Numbering: N-YY (e.g. 9-26, 44-25) =====
const COUNTER_KEY = "paperline_doc_counter";

const hasLS = () => typeof window !== "undefined" && !!window.localStorage;

function yy(): string {
  return String(new Date().getFullYear()).slice(-2);
}

export function peekNextNumber(): string {
  const year = new Date().getFullYear();
  let next = 1;
  if (hasLS()) {
    const raw = localStorage.getItem(COUNTER_KEY);
    if (raw) {
      try {
        const { year: y, n } = JSON.parse(raw);
        next = y === year ? n + 1 : 1;
      } catch {
        /* ignore */
      }
    }
  }
  return `${next}-${yy()}`;
}

export function consumeNextNumber(): string {
  const num = peekNextNumber();
  if (!hasLS()) return num;
  const year = new Date().getFullYear();
  const n = parseInt(num.split("-")[0], 10);
  localStorage.setItem(COUNTER_KEY, JSON.stringify({ year, n }));
  return num;
}

// ===== History =====
export interface HistoryEntry {
  id: string;
  number: string;
  kind: DocKind;
  lang: Lang;
  /** Template id for contract; ignored for offers. */
  templateId?: TemplateId;
  templateTitle: string;
  partnerName: string;
  createdAt: string;
  /** Contract vars (when kind === 'contract'). */
  vars?: ContractVars;
  /** JSON payload for offers (raw form data). */
  payload?: unknown;
}

const HISTORY_KEY = "paperline_doc_history";

export function loadHistory(): HistoryEntry[] {
  if (!hasLS()) return [];
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveHistory(entries: HistoryEntry[]) {
  if (!hasLS()) return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
}

export function addHistory(entry: HistoryEntry) {
  const list = loadHistory();
  list.unshift(entry);
  saveHistory(list);
}

export function removeHistory(id: string) {
  saveHistory(loadHistory().filter((e) => e.id !== id));
}

export function updateHistory(entry: HistoryEntry) {
  const list = loadHistory().map((e) => (e.id === entry.id ? entry : e));
  saveHistory(list);
}
