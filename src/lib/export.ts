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
} from "docx";
import fileSaver from "file-saver";
const { saveAs } = fileSaver;
import logoUrl from "@/assets/borealis-logo.jpg";

export interface ExportPayload {
  number: string;
  templateTitle: string;
  body: string; // filled-in contract body (with ## / ### / **bold** markup)
}

export async function exportPdf(el: HTMLElement, filename: string) {
  const html2pdf = (await import("html2pdf.js")).default;
  await html2pdf()
    .set({
      margin: [15, 15, 15, 15],
      filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    } as never)
    .from(el)
    .save();
}

/** Parse a single line into TextRuns, handling **bold** inline. */
function runsFromLine(
  line: string,
  opts: { bold?: boolean; size?: number } = {},
): TextRun[] {
  const size = opts.size ?? 21; // half-points => 10.5pt
  const parts = line.split(/(\*\*[^*]+\*\*)/g).filter((p) => p !== "");
  if (parts.length === 0) return [new TextRun({ text: "", size, font: "Inter" })];
  return parts.map((p) => {
    const isBold = p.startsWith("**") && p.endsWith("**");
    return new TextRun({
      text: isBold ? p.slice(2, -2) : p,
      bold: opts.bold || isBold,
      size,
      font: "Inter",
    });
  });
}

function paragraphsFromBody(body: string): Paragraph[] {
  const out: Paragraph[] = [];
  for (const raw of body.split("\n")) {
    const line = raw.trimEnd();
    if (line === "") {
      out.push(new Paragraph({ children: [new TextRun("")] }));
      continue;
    }
    if (line.startsWith("## ")) {
      out.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 240, after: 180 },
          children: runsFromLine(line.slice(3), { bold: true, size: 22 }),
        }),
      );
      continue;
    }
    if (line.startsWith("### ")) {
      out.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 160, after: 120 },
          children: runsFromLine(line.slice(4), { bold: true, size: 22 }),
        }),
      );
      continue;
    }
    out.push(
      new Paragraph({
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 120, line: 310 },
        children: runsFromLine(line),
      }),
    );
  }
  return out;
}

async function loadLogoBytes(): Promise<ArrayBuffer> {
  const res = await fetch(logoUrl);
  return await res.arrayBuffer();
}

export async function exportDocx(payload: ExportPayload, filename: string) {
  const { number, templateTitle, body } = payload;
  const logoData = await loadLogoBytes();

  const headerLogo = new Paragraph({
    alignment: AlignmentType.LEFT,
    children: [
      new ImageRun({
        type: "jpg",
        data: logoData,
        transformation: { width: 120, height: 32 },
      } as never),
    ],
  });

  const headerInfo = new Paragraph({
    alignment: AlignmentType.RIGHT,
    children: [
      new TextRun({
        text: "Borealis d.o.o. · Ljutomerska 7, 10000 Zagreb · borealis.agency · info@borealis.biz",
        size: 16,
        font: "Inter",
        color: "555555",
      }),
    ],
  });

  const title = new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 200 },
    children: [
      new TextRun({
        text: templateTitle.toUpperCase(),
        bold: true,
        size: 24,
        font: "Inter",
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
        size: 18,
        font: "Inter",
        color: "E63329",
      }),
    ],
  });

  const footerPara = new Paragraph({
    alignment: AlignmentType.RIGHT,
    children: [
      new TextRun({ text: "Stranica ", size: 16, font: "Inter", color: "888888" }),
      new TextRun({ children: [PageNumber.CURRENT], size: 16, font: "Inter", color: "888888" }),
      new TextRun({ text: " / ", size: 16, font: "Inter", color: "888888" }),
      new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, font: "Inter", color: "888888" }),
    ],
  });

  const doc = new Document({
    creator: "Borealis",
    title: templateTitle,
    styles: {
      default: { document: { run: { font: "Inter", size: 21 } } },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1134, left: 1440, right: 1440 },
          },
        },
        headers: {
          default: new Header({ children: [headerLogo, headerInfo] }),
        },
        footers: {
          default: new Footer({ children: [footerPara] }),
        },
        children: [numberLine, title, ...paragraphsFromBody(body)],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}
