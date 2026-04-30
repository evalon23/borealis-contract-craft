import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  ImageRun,
  Header,
  Footer,
  PageNumber,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  TabStopType,
} from "docx";
import fileSaver from "file-saver";
const { saveAs } = fileSaver;
import { BRAND } from "@/lib/branding";
import type { ContractVars } from "./contract";
import { fillTemplate } from "./contract";

export interface ExportPayload {
  number: string;
  templateTitle: string;
  body: string; // raw template body (still contains {{VARS}} — we fill here)
  vars: ContractVars;
}

const FONT = BRAND.docxFont; // "Calibri"
const BODY_SIZE = 22; // half-points -> 11pt

// ---------- Inline text runs ----------

/** Build TextRuns from a plain-text line with **bold** markup. */
function runsFromPlain(
  line: string,
  opts: { bold?: boolean; size?: number } = {},
): TextRun[] {
  const size = opts.size ?? BODY_SIZE;
  const parts = line.split(/(\*\*[^*]+\*\*)/g).filter((p) => p !== "");
  if (parts.length === 0)
    return [new TextRun({ text: "", size, font: FONT })];
  return parts.map((p) => {
    const isBold = p.startsWith("**") && p.endsWith("**");
    return new TextRun({
      text: isBold ? p.slice(2, -2) : p,
      bold: opts.bold || isBold,
      size,
      font: FONT,
    });
  });
}

// ---------- HTML parsing (rich-text fields) ----------

type InlineStyle = { bold?: boolean; italic?: boolean };

interface HtmlBlock {
  kind: "p" | "li-bullet" | "li-number";
  runs: TextRun[];
}

function textRunsFromHtmlNode(
  node: Node,
  style: InlineStyle,
): TextRun[] {
  if (node.nodeType === 3 /* text */) {
    const text = (node.textContent ?? "").replace(/\s+/g, " ");
    if (!text) return [];
    return [
      new TextRun({
        text,
        bold: style.bold,
        italics: style.italic,
        size: BODY_SIZE,
        font: FONT,
      }),
    ];
  }
  if (node.nodeType !== 1) return [];
  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();
  const next: InlineStyle = {
    ...style,
    bold: style.bold || tag === "strong" || tag === "b",
    italic: style.italic || tag === "em" || tag === "i",
  };
  const out: TextRun[] = [];
  el.childNodes.forEach((c) => out.push(...textRunsFromHtmlNode(c, next)));
  return out;
}

/** Parse an HTML fragment into block-level pieces we can emit as docx paragraphs. */
function parseHtmlFragment(html: string): HtmlBlock[] {
  if (typeof window === "undefined") {
    // SSR fallback: strip tags.
    const stripped = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return stripped ? [{ kind: "p", runs: runsFromPlain(stripped) }] : [];
  }
  const doc = new DOMParser().parseFromString(`<div>${html}</div>`, "text/html");
  const root = doc.body.firstElementChild;
  if (!root) return [];
  const blocks: HtmlBlock[] = [];
  const walk = (el: Element) => {
    Array.from(el.children).forEach((child) => {
      const tag = child.tagName.toLowerCase();
      if (tag === "ul") {
        Array.from(child.children).forEach((li) => {
          const runs: TextRun[] = [];
          li.childNodes.forEach((n) =>
            runs.push(...textRunsFromHtmlNode(n, {})),
          );
          if (runs.length) blocks.push({ kind: "li-bullet", runs });
        });
      } else if (tag === "ol") {
        Array.from(child.children).forEach((li) => {
          const runs: TextRun[] = [];
          li.childNodes.forEach((n) =>
            runs.push(...textRunsFromHtmlNode(n, {})),
          );
          if (runs.length) blocks.push({ kind: "li-number", runs });
        });
      } else {
        // p, div, or anything else: treat as paragraph
        const runs: TextRun[] = [];
        child.childNodes.forEach((n) =>
          runs.push(...textRunsFromHtmlNode(n, {})),
        );
        if (runs.length) blocks.push({ kind: "p", runs });
      }
    });
  };
  walk(root);
  return blocks;
}

// ---------- Body -> Paragraphs ----------

function signatureTable(vars: ContractVars): Table {
  const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
  const borders = {
    top: noBorder,
    bottom: noBorder,
    left: noBorder,
    right: noBorder,
  };
  const cellParas = (lines: { text: string; bold?: boolean; top?: number }[]) =>
    lines.map(
      (l) =>
        new Paragraph({
          spacing: { before: l.top ?? 0, after: 40 },
          children: [
            new TextRun({
              text: l.text,
              bold: l.bold,
              size: BODY_SIZE,
              font: FONT,
            }),
          ],
        }),
    );

  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [4680, 4680],
    borders: {
      top: noBorder,
      bottom: noBorder,
      left: noBorder,
      right: noBorder,
      insideHorizontal: noBorder,
      insideVertical: noBorder,
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            borders,
            width: { size: 4680, type: WidthType.DXA },
            children: cellParas([
              { text: "NARUČITELJ:", bold: true },
              { text: "___________________________", top: 400 },
              {
                text:
                  (vars.PARTNER_REP || "") +
                  (vars.PARTNER_REP_TITLE
                    ? `, ${vars.PARTNER_REP_TITLE}`
                    : ""),
              },
              { text: vars.PARTNER_NAME || "" },
            ]),
          }),
          new TableCell({
            borders,
            width: { size: 4680, type: WidthType.DXA },
            children: cellParas([
              { text: "IZVOĐAČ:", bold: true },
              { text: "___________________________", top: 400 },
              {
                text: `${vars.BOREALIS_REP || "Dennis Puzak"}, Direktor`,
              },
              { text: "Borealis d.o.o." },
            ]),
          }),
        ],
      }),
    ],
  });
}

function bodyToChildren(
  body: string,
  vars: ContractVars,
): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = [];
  for (const raw of body.split("\n")) {
    const line = raw.trimEnd();
    if (line === "") {
      out.push(new Paragraph({ children: [new TextRun("")] }));
      continue;
    }
    if (line === "@@SIGNATURE@@") {
      out.push(
        new Paragraph({ spacing: { before: 400 }, children: [new TextRun("")] }),
      );
      out.push(signatureTable(vars));
      continue;
    }
    if (line.startsWith("## ")) {
      out.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 240, after: 180 },
          children: runsFromPlain(line.slice(3), { bold: true, size: 24 }),
        }),
      );
      continue;
    }
    if (line.startsWith("### ")) {
      out.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 160, after: 120 },
          children: runsFromPlain(line.slice(4), { bold: true, size: 22 }),
        }),
      );
      continue;
    }
    // HTML line from rich-text field?
    if (/<(p|ul|ol|h[1-6]|li|div|br)\b/i.test(line) || /^<\w+/.test(line)) {
      const blocks = parseHtmlFragment(line);
      for (const b of blocks) {
        if (b.kind === "li-bullet") {
          out.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 80 },
              children: b.runs,
            }),
          );
        } else if (b.kind === "li-number") {
          out.push(
            new Paragraph({
              numbering: { reference: "rt-numbers", level: 0 },
              spacing: { after: 80 },
              children: b.runs,
            }),
          );
        } else {
          out.push(
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 120, line: 300 },
              children: b.runs,
            }),
          );
        }
      }
      continue;
    }
    out.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 120, line: 300 },
        children: runsFromPlain(line),
      }),
    );
  }
  return out;
}

// ---------- Exports ----------

/**
 * Open the contract in a new window and trigger the browser print dialog.
 * User can then choose "Save as PDF" or print directly. This uses native
 * browser PDF rendering — most reliable approach across all browsers.
 */
export async function exportPdf(el: HTMLElement, filename: string) {
  const win = window.open("", "_blank", "width=900,height=1200");
  if (!win) {
    throw new Error("Popup zablokiran. Dozvolite popupove za ovu stranicu.");
  }

  // Collect all stylesheets from current document so the clone renders identically.
  const styles: string[] = [];
  document.querySelectorAll('link[rel="stylesheet"], style').forEach((node) => {
    styles.push(node.outerHTML);
  });

  const docTitle = filename.replace(/\.pdf$/i, "");

  win.document.open();
  win.document.write(`<!DOCTYPE html>
<html lang="hr">
<head>
<meta charset="utf-8" />
<title>${docTitle}</title>
${styles.join("\n")}
<style>
  @page { size: A4; margin: 0; }
  html, body { margin: 0; padding: 0; background: #fff; }
  body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .contract-paper { box-shadow: none !important; outline: none !important; page-break-after: always; break-after: page; }
  .contract-paper:last-child { page-break-after: auto; break-after: auto; }
</style>
</head>
<body>${el.innerHTML}</body>
</html>`);
  win.document.close();

  // Wait for fonts/images to load, then trigger print.
  const triggerPrint = () => {
    try {
      win.focus();
      win.print();
    } catch {
      /* noop */
    }
  };

  if (win.document.readyState === "complete") {
    setTimeout(triggerPrint, 400);
  } else {
    win.addEventListener("load", () => setTimeout(triggerPrint, 400));
  }
}

async function loadLogoBytes(): Promise<ArrayBuffer> {
  const res = await fetch(BRAND.headerImage);
  return await res.arrayBuffer();
}

export async function exportDocx(payload: ExportPayload, filename: string) {
  const { number, templateTitle, body, vars } = payload;
  const filled = fillTemplate(body, vars);
  const logoData = await loadLogoBytes();

  const headerLogo = new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 40 },
    tabStops: [{ type: TabStopType.RIGHT, position: 9360 }],
    children: [
      new ImageRun({
        type: "png",
        data: logoData,
        transformation: { width: 180, height: 36 },
      } as never),
      new TextRun("\t"),
      new TextRun({
        text: `${BRAND.headerDetails[0]?.title ?? ""} · ${BRAND.headerDetails[0]?.lines.join(" ") ?? ""}`,
        size: 16,
        font: FONT,
      }),
    ],
  });

  const headerDetails = new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { after: 120 },
    children: [
      new TextRun({
        text: `${BRAND.headerDetails[1]?.title ?? ""}, ${BRAND.headerDetails[1]?.lines.join(" ") ?? ""}   ·   ${BRAND.headerDetails[2]?.title ?? ""}   ·   ${BRAND.headerDetails[2]?.lines.join(" ") ?? ""}`,
        size: 16,
        font: FONT,
      }),
    ],
  });

  const numberLine = new Paragraph({
    alignment: AlignmentType.RIGHT,
    spacing: { after: 120 },
    children: [
      new TextRun({
        text: `Broj ugovora: ${number}`,
        bold: true,
        size: 20,
        font: FONT,
        color: "E63329",
      }),
    ],
  });

  const footerPara = new Paragraph({
    alignment: AlignmentType.LEFT,
    children: [
      new TextRun({
        text: `${BRAND.footerLine}   ·   Stranica `,
        size: 16,
        font: FONT,
        color: "888888",
      }),
      new TextRun({
        children: [PageNumber.CURRENT],
        size: 16,
        font: FONT,
        color: "888888",
      }),
      new TextRun({ text: " / ", size: 16, font: FONT, color: "888888" }),
      new TextRun({
        children: [PageNumber.TOTAL_PAGES],
        size: 16,
        font: FONT,
        color: "888888",
      }),
    ],
  });

  const doc = new Document({
    creator: "Borealis",
    title: templateTitle,
    styles: {
      default: { document: { run: { font: FONT, size: BODY_SIZE } } },
    },
    numbering: {
      config: [
        {
          reference: "rt-numbers",
          levels: [
            {
              level: 0,
              format: "decimal",
              text: "%1.",
              alignment: AlignmentType.LEFT,
              style: { paragraph: { indent: { left: 720, hanging: 360 } } },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1134, left: 1440, right: 1440 },
          },
        },
        headers: {
          default: new Header({ children: [headerLogo, headerDetails] }),
        },
        footers: {
          default: new Footer({ children: [footerPara] }),
        },
        children: [numberLine, ...bodyToChildren(filled, vars)],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}
