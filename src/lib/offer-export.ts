import {
  Document, Packer, Paragraph, TextRun, AlignmentType, ImageRun, Header, Footer,
  PageNumber, Table, TableRow, TableCell, WidthType, BorderStyle, HeightRule,
} from "docx";
import fileSaver from "file-saver";
const { saveAs } = fileSaver;
import { BRAND } from "@/lib/branding";
import { t, formatDate, formatMoney, type Lang } from "@/lib/i18n";
import type { SimpleOfferData } from "@/lib/offer-simple";
import { lineTotal, offerTotals } from "@/lib/offer-simple";
import type { DetailedOfferData } from "@/lib/offer-detailed";
import { sumHours, sumExact, sumBallpark } from "@/lib/offer-detailed";

const FONT = BRAND.docxFont;
const SIZE = 20;

async function logoBytes(): Promise<ArrayBuffer> {
  const res = await fetch(BRAND.headerImage);
  return await res.arrayBuffer();
}

function p(text: string, opts: { bold?: boolean; size?: number; align?: typeof AlignmentType[keyof typeof AlignmentType]; color?: string } = {}): Paragraph {
  return new Paragraph({
    alignment: opts.align,
    spacing: { after: 80 },
    children: [new TextRun({ text, bold: opts.bold, size: opts.size ?? SIZE, font: FONT, color: opts.color })],
  });
}

function headingP(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 200, after: 120 },
    children: [new TextRun({ text, bold: true, size: 26, font: FONT })],
  });
}

function tableCell(text: string, opts: { bold?: boolean; align?: typeof AlignmentType[keyof typeof AlignmentType]; width?: number; shade?: string } = {}): TableCell {
  return new TableCell({
    width: opts.width ? { size: opts.width, type: WidthType.DXA } : undefined,
    shading: opts.shade ? { fill: opts.shade, type: "clear" as never } : undefined,
    margins: { top: 60, bottom: 60, left: 80, right: 80 },
    children: [new Paragraph({
      alignment: opts.align,
      children: [new TextRun({ text, bold: opts.bold, size: 18, font: FONT })],
    })],
  });
}

const thinBorder = { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" };
const allBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder };

function buildHeaderFooter(logo: ArrayBuffer, number: string) {
  const headerLogo = new Paragraph({
    alignment: AlignmentType.LEFT,
    children: [
      new ImageRun({ type: "png", data: logo, transformation: { width: 140, height: 28 } } as never),
    ],
  });
  const footerPara = new Paragraph({
    alignment: AlignmentType.LEFT,
    children: [
      new TextRun({ text: `${BRAND.footerLine}   ·   № ${number}   ·   `, size: 14, font: FONT, color: "888888" }),
      new TextRun({ children: [PageNumber.CURRENT], size: 14, font: FONT, color: "888888" }),
      new TextRun({ text: " / ", size: 14, font: FONT, color: "888888" }),
      new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 14, font: FONT, color: "888888" }),
    ],
  });
  return {
    headers: { default: new Header({ children: [headerLogo] }) },
    footers: { default: new Footer({ children: [footerPara] }) },
  };
}

// ===== Simple offer DOCX =====

async function buildSimpleOfferDoc(d: SimpleOfferData): Promise<Document> {
  const lang = d.lang;
  const logo = await logoBytes();
  const totals = offerTotals(d);

  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      tableCell("№", { bold: true, shade: "F0F0F0" }),
      tableCell(t("item", lang), { bold: true, shade: "F0F0F0" }),
      tableCell(t("currency", lang), { bold: true, shade: "F0F0F0", align: AlignmentType.RIGHT }),
      tableCell(t("price", lang), { bold: true, shade: "F0F0F0", align: AlignmentType.RIGHT }),
      tableCell(t("qty", lang), { bold: true, shade: "F0F0F0", align: AlignmentType.RIGHT }),
      tableCell(t("unit", lang), { bold: true, shade: "F0F0F0" }),
      tableCell(t("total", lang), { bold: true, shade: "F0F0F0", align: AlignmentType.RIGHT }),
      tableCell(t("vat", lang), { bold: true, shade: "F0F0F0", align: AlignmentType.RIGHT }),
    ],
  });

  const itemRows = d.lines.map((l, i) => new TableRow({
    children: [
      tableCell(String(i + 1)),
      tableCell(l.item),
      tableCell(l.currency, { align: AlignmentType.RIGHT }),
      tableCell(l.price.toFixed(2), { align: AlignmentType.RIGHT }),
      tableCell(String(l.qty), { align: AlignmentType.RIGHT }),
      tableCell(l.unit),
      tableCell(lineTotal(l).toFixed(2), { align: AlignmentType.RIGHT }),
      tableCell(l.vatRate > 0 ? `${l.vatRate}%` : "—", { align: AlignmentType.RIGHT }),
    ],
  }));

  const totalRow = new TableRow({
    children: [
      tableCell(""), tableCell(""), tableCell(""), tableCell(""), tableCell(""), tableCell(""),
      tableCell(`${t("total", lang)}:`, { bold: true, align: AlignmentType.RIGHT }),
      tableCell(formatMoney(totals.total, "EUR", lang), { bold: true, align: AlignmentType.RIGHT }),
    ],
  });

  const itemsTable = new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [600, 3500, 800, 900, 600, 700, 1100, 1160],
    borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder, insideHorizontal: thinBorder, insideVertical: thinBorder },
    rows: [headerRow, ...itemRows, totalRow],
  });

  // Client + estimate header table (2 columns)
  const clientLines = [
    d.client.name,
    d.client.address,
    [d.client.city, d.client.country].filter(Boolean).join(", "),
    d.client.vatId ? `VAT ID: ${d.client.vatId}` : "",
  ].filter(Boolean);

  const metaTable = new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [4680, 4680],
    borders: { top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" } },
    rows: [new TableRow({
      children: [
        new TableCell({
          width: { size: 4680, type: WidthType.DXA },
          children: [
            p(t("client", lang).toUpperCase(), { bold: true, size: 16, color: "888888" }),
            ...clientLines.map((line, i) => p(line, { bold: i === 0 })),
          ],
        }),
        new TableCell({
          width: { size: 4680, type: WidthType.DXA },
          children: [
            p(t("estimate_number", lang).toUpperCase(), { bold: true, size: 16, color: "888888", align: AlignmentType.RIGHT }),
            p(d.number, { bold: true, size: 28, color: "E63329", align: AlignmentType.RIGHT }),
            p(`${t("date_of_issue", lang)}: ${formatDate(d.date, lang)}`, { align: AlignmentType.RIGHT, size: 18 }),
            p(`${t("payment_method", lang)}: ${d.paymentMethod}`, { align: AlignmentType.RIGHT, size: 18 }),
          ],
        }),
      ],
    })],
  });

  const paymentParas = [
    headingP(t("payment_information", lang)),
    p(`${t("iban", lang)}: ${d.payment.iban}`),
    p(`${t("swift", lang)}: ${d.payment.swift}`),
    ...(d.payment.note ? [p(`${t("payment_note", lang)}: ${d.payment.note}`)] : []),
    ...(d.payment.reference ? [p(`${t("reference_number", lang)}: ${d.payment.reference}`)] : []),
  ];
  const noteParas = d.note ? [headingP(t("note", lang)), p(d.note)] : [];

  return new Document({
    creator: "Borealis",
    title: `${t("kind_offer_simple", lang)} ${d.number}`,
    styles: { default: { document: { run: { font: FONT, size: SIZE } } } },
    sections: [{
      properties: { page: { margin: { top: 1440, bottom: 1134, left: 1440, right: 1440 } } },
      ...buildHeaderFooter(logo, d.number),
      children: [
        metaTable,
        new Paragraph({ children: [new TextRun("")] }),
        itemsTable,
        new Paragraph({ children: [new TextRun("")] }),
        ...paymentParas,
        ...noteParas,
      ],
    }],
  });
}

export async function exportSimpleOfferDocxBlob(d: SimpleOfferData): Promise<Blob> {
  return Packer.toBlob(await buildSimpleOfferDoc(d));
}
export async function exportSimpleOfferDocx(d: SimpleOfferData, filename: string) {
  saveAs(await exportSimpleOfferDocxBlob(d), filename);
}

// ===== Detailed offer DOCX =====

function htmlToParas(html: string): Paragraph[] {
  if (!html) return [];
  if (typeof window === "undefined") {
    return [p(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim())];
  }
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
  const root = doc.body.firstElementChild;
  if (!root) return [];
  const out: Paragraph[] = [];
  Array.from(root.children).forEach((el) => {
    const tag = el.tagName.toLowerCase();
    if (tag === "ul" || tag === "ol") {
      Array.from(el.children).forEach((li) => {
        out.push(new Paragraph({
          bullet: tag === "ul" ? { level: 0 } : undefined,
          numbering: tag === "ol" ? { reference: "rt-num", level: 0 } : undefined,
          spacing: { after: 60 },
          children: [new TextRun({ text: (li.textContent || "").trim(), size: SIZE, font: FONT })],
        }));
      });
    } else {
      out.push(p((el.textContent || "").trim()));
    }
  });
  return out;
}

function simpleTable(rows: { cells: { text: string; bold?: boolean; align?: typeof AlignmentType[keyof typeof AlignmentType] }[]; header?: boolean }[]): Table {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    borders: { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder, insideHorizontal: thinBorder, insideVertical: thinBorder },
    rows: rows.map((r) => new TableRow({
      tableHeader: r.header,
      children: r.cells.map((c) => tableCell(c.text, { bold: c.bold, align: c.align, shade: r.header ? "F0F0F0" : undefined })),
    })),
  });
}

async function buildDetailedOfferDoc(d: DetailedOfferData): Promise<Document> {
  const lang = d.lang;
  const logo = await logoBytes();
  const exact = sumExact(d.exactEstimates);
  const ballpark = sumBallpark(d.ballparkEstimates);
  const milestoneTotal = d.milestones.reduce((s, m) => s + (m.amount || 0), 0);

  const children: (Paragraph | Table)[] = [];

  // Meta header
  children.push(p(d.client.name || "—", { bold: true, size: 22 }));
  if (d.client.address) children.push(p(d.client.address));
  const cityCountry = [d.client.city, d.client.country].filter(Boolean).join(", ");
  if (cityCountry) children.push(p(cityCountry));
  if (d.client.vatId) children.push(p(`VAT ID: ${d.client.vatId}`));
  children.push(p(""));
  children.push(p(`${t("project_name", lang)}: ${d.projectName}`, { bold: true, size: 24 }));
  children.push(p(`${t("estimate_number", lang)}: ${d.number}    ·    ${formatDate(d.date, lang)}`));

  if (d.specification) {
    children.push(headingP(t("specification", lang)));
    children.push(...htmlToParas(d.specification));
  }
  if (d.technicalImplementation) {
    children.push(headingP(t("technical_implementation", lang)));
    children.push(...htmlToParas(d.technicalImplementation));
  }

  children.push(headingP(`${t("phases", lang)} — ${t("ux_ui", lang)}`));
  children.push(simpleTable([
    { header: true, cells: [{ text: t("phase", lang), bold: true }, { text: "h", bold: true, align: AlignmentType.RIGHT }] },
    ...d.designHours.map((r) => ({ cells: [{ text: r.label }, { text: String(r.hours), align: AlignmentType.RIGHT }] })),
    { cells: [{ text: t("total", lang), bold: true, align: AlignmentType.RIGHT }, { text: `${sumHours(d.designHours)} h`, bold: true, align: AlignmentType.RIGHT }] },
  ]));

  children.push(headingP(`${t("phases", lang)} — ${t("development", lang)}`));
  children.push(simpleTable([
    { header: true, cells: [{ text: t("phase", lang), bold: true }, { text: "h", bold: true, align: AlignmentType.RIGHT }] },
    ...d.developmentHours.map((r) => ({ cells: [{ text: r.label }, { text: String(r.hours), align: AlignmentType.RIGHT }] })),
    { cells: [{ text: t("total", lang), bold: true, align: AlignmentType.RIGHT }, { text: `${sumHours(d.developmentHours)} h`, bold: true, align: AlignmentType.RIGHT }] },
  ]));

  children.push(headingP(t("pricing_estimate", lang)));
  if (d.exactEstimates.length > 0) {
    children.push(p(t("exact_estimates", lang), { bold: true }));
    children.push(simpleTable([
      { header: true, cells: [{ text: t("phase", lang), bold: true }, { text: "h", bold: true, align: AlignmentType.RIGHT }, { text: t("price", lang), bold: true, align: AlignmentType.RIGHT }] },
      ...d.exactEstimates.map((r) => ({ cells: [{ text: r.phase }, { text: String(r.hours), align: AlignmentType.RIGHT }, { text: `${formatMoney(r.price, "EUR", lang)} ${t("vat_excluded", lang)}`, align: AlignmentType.RIGHT }] })),
      { cells: [{ text: t("total", lang), bold: true, align: AlignmentType.RIGHT }, { text: String(exact.hours), bold: true, align: AlignmentType.RIGHT }, { text: `${formatMoney(exact.price, "EUR", lang)} ${t("vat_excluded", lang)}`, bold: true, align: AlignmentType.RIGHT }] },
    ]));
  }
  if (d.ballparkEstimates.length > 0) {
    children.push(p(t("ballpark_estimates", lang), { bold: true }));
    children.push(simpleTable([
      { header: true, cells: [{ text: t("phase", lang), bold: true }, { text: "h", bold: true, align: AlignmentType.RIGHT }, { text: t("price", lang), bold: true, align: AlignmentType.RIGHT }] },
      ...d.ballparkEstimates.map((r) => ({ cells: [{ text: r.phase }, { text: r.hours, align: AlignmentType.RIGHT }, { text: `${formatMoney(r.priceMin, "EUR", lang)} – ${formatMoney(r.priceMax, "EUR", lang)} ${t("vat_excluded", lang)}`, align: AlignmentType.RIGHT }] })),
      { cells: [{ text: t("total", lang), bold: true, align: AlignmentType.RIGHT }, { text: "", bold: true }, { text: `${formatMoney(ballpark.min, "EUR", lang)} – ${formatMoney(ballpark.max, "EUR", lang)} ${t("vat_excluded", lang)}`, bold: true, align: AlignmentType.RIGHT }] },
    ]));
  }

  if (d.delivery) {
    children.push(headingP(t("delivery", lang)));
    children.push(p(d.delivery));
  }

  if (d.milestones.length > 0) {
    children.push(headingP(t("payment_milestones", lang)));
    children.push(simpleTable([
      { header: true, cells: [{ text: t("phase", lang), bold: true }, { text: t("percent", lang), bold: true, align: AlignmentType.RIGHT }, { text: t("amount", lang), bold: true, align: AlignmentType.RIGHT }] },
      ...d.milestones.map((m) => ({ cells: [{ text: m.label }, { text: `${m.percent}%`, align: AlignmentType.RIGHT }, { text: `${formatMoney(m.amount, "EUR", lang)} ${t("vat_excluded", lang)}`, align: AlignmentType.RIGHT }] })),
      { cells: [{ text: t("total", lang), bold: true, align: AlignmentType.RIGHT }, { text: "", bold: true }, { text: `${formatMoney(milestoneTotal, "EUR", lang)} ${t("vat_excluded", lang)}`, bold: true, align: AlignmentType.RIGHT }] },
    ]));
  }

  if (d.notes) {
    children.push(headingP(t("note", lang)));
    children.push(p(d.notes));
  }
  // Suppress unused-var
  void HeightRule;

  return new Document({
    creator: "Borealis",
    title: `${t("kind_offer_detailed", lang)} ${d.number}`,
    styles: { default: { document: { run: { font: FONT, size: SIZE } } } },
    numbering: { config: [{ reference: "rt-num", levels: [{ level: 0, format: "decimal", text: "%1.", alignment: AlignmentType.LEFT }] }] },
    sections: [{
      properties: { page: { margin: { top: 1440, bottom: 1134, left: 1440, right: 1440 } } },
      ...buildHeaderFooter(logo, d.number),
      children,
    }],
  });
}

export async function exportDetailedOfferDocxBlob(d: DetailedOfferData): Promise<Blob> {
  return Packer.toBlob(await buildDetailedOfferDoc(d));
}
export async function exportDetailedOfferDocx(d: DetailedOfferData, filename: string) {
  saveAs(await exportDetailedOfferDocxBlob(d), filename);
}

// ===== Print PDF (shared) =====
export async function printElement(el: HTMLElement, filename: string, lang: Lang) {
  const win = window.open("", "_blank", "width=900,height=1200");
  if (!win) throw new Error(lang === "hr" ? "Popup zablokiran." : "Popup blocked.");
  const styles: string[] = [];
  document.querySelectorAll('link[rel="stylesheet"], style').forEach((n) => styles.push(n.outerHTML));
  win.document.open();
  win.document.write(`<!DOCTYPE html><html lang="${lang}"><head><meta charset="utf-8"/><title>${filename}</title>${styles.join("\n")}<style>
@page { size: A4; margin: 0; }
html,body { margin:0; padding:0; background:#fff; }
body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.contract-paper { box-shadow:none !important; outline:none !important; page-break-after: always; break-after: page; }
.contract-paper:last-child { page-break-after: auto; break-after: auto; }
</style></head><body>${el.innerHTML}</body></html>`);
  win.document.close();
  const trigger = () => { try { win.focus(); win.print(); } catch { /* */ } };
  if (win.document.readyState === "complete") setTimeout(trigger, 400);
  else win.addEventListener("load", () => setTimeout(trigger, 400));
}
