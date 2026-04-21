import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
} from "docx";
import { saveAs } from "file-saver";

export interface ExportPayload {
  number: string;
  templateTitle: string;
  body: string; // filled-in contract body
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
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    })
    .from(el)
    .save();
}

export async function exportDocx(payload: ExportPayload, filename: string) {
  const { number, templateTitle, body } = payload;

  const children: Paragraph[] = [];

  // Letterhead
  children.push(
    new Paragraph({
      children: [new TextRun({ text: "Borealis d.o.o.", bold: true, size: 28 })],
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "Ljutomerska ulica 7, 10 000 Zagreb", size: 20 }),
      ],
    }),
    new Paragraph({
      children: [new TextRun({ text: "OIB: 69433981874", size: 20 })],
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: "IBAN: HR8723400091110560684, Privredna banka Zagreb",
          size: 20,
        }),
      ],
    }),
    new Paragraph({ children: [new TextRun("")] }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: templateTitle, bold: true, size: 28 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `Broj ugovora: ${number}`, bold: true, size: 22 })],
    }),
    new Paragraph({ children: [new TextRun("")] }),
  );

  // Body paragraphs
  body.split("\n").forEach((line) => {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: line, size: 22 })],
      }),
    );
  });

  const doc = new Document({
    creator: "Borealis",
    title: templateTitle,
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}
