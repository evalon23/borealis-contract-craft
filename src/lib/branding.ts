// Single source of truth for brand assets used across preview + exports.
// Swap the logo by replacing the file at src/assets/borealis-header.png.
import headerLogo from "@/assets/borealis-logo-horizontal.png";

export const BRAND = {
  /** Full header lockup (logo + contact info strip). Used in preview + docx header. */
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
  /** Google Drive folder ID where exported contracts are uploaded. */
  driveFolderId: "13SSoNhYmdu-pPUq_Bw8E9aTvCOm9_wzG",
  /** Proportions of the header image (for aspect-ratio on preview). */
  headerAspect: 1560 / 220, // width / height (approx. for the uploaded strip)
  /** Font stack used in the contract preview and exports. */
  fontStack: "'Calibri', 'Carlito', sans-serif",
  /** Font name used in the docx export (first available on user's machine). */
  docxFont: "Calibri",
  footerLine:
    "Borealis d.o.o. · OIB: 69433981874 · IBAN: HR8723400091110560684",
};
