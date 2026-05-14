// Single source of truth for brand assets used across preview + exports.
import headerLogo from "@/assets/borealis-logo-horizontal.png";

export const APP_NAME = "Paperline";

export const BRAND = {
  appName: APP_NAME,
  /** Full header lockup (logo). Used in preview + docx header. */
  headerImage: headerLogo,
  headerDetails: [
    {
      icon: "building" as const,
      title: "Borealis d.o.o.",
      lines: ["development & design"],
    },
    {
      icon: "map-pin" as const,
      title: "Ljutomerska 7",
      lines: ["10000 Zagreb"],
    },
    {
      icon: "globe" as const,
      title: "borealis.agency",
      lines: ["info@borealis.biz"],
    },
  ],
  /** Google Drive folder ID where exported documents are uploaded. */
  driveFolderId: "13SSoNhYmdu-pPUq_Bw8E9aTvCOm9_wzG",
  /** Proportions of the header image (for aspect-ratio on preview). */
  headerAspect: 1560 / 220,
  fontStack: "'Calibri', 'Carlito', sans-serif",
  docxFont: "Calibri",
  /** Company legal info — shown in footer of every document. */
  footerLine:
    "Borealis d.o.o. · Ljutomerska 7 · 10000 Zagreb · MBS: 080826981 · OIB: 69433981874 · info@borealis.biz",
  /** Default payment info used for offers (can be overridden per document). */
  defaultPayment: {
    iban: "HR4525000091101577810",
    swift: "HAABHR22XXX",
  },
};
