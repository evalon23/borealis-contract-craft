import { forwardRef } from "react";
import type { ContractVars } from "@/lib/contract";
import { fillTemplate } from "@/lib/contract";
import logo from "@/assets/borealis-logo.jpg";

interface Props {
  number: string;
  templateTitle: string;
  templateBody: string;
  vars: ContractVars;
}

function Letterhead() {
  return (
    <div className="flex items-start justify-between gap-4 pb-4">
      <img src={logo} alt="Borealis" className="h-10 w-auto object-contain" />
      <div className="flex flex-1 items-start justify-around gap-4 text-[9pt] text-neutral-800">
        <div className="flex flex-col items-center">
          <span className="mb-1 text-[color:var(--primary)]">▦</span>
          <span className="text-center leading-tight">
            Borealis d.o.o.
            <br />
            development &amp; design
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="mb-1 text-[color:var(--primary)]">◎</span>
          <span className="text-center leading-tight">
            Ljutomerska 7,
            <br />
            10000 Zagreb
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="mb-1 text-[color:var(--primary)]">◍</span>
          <span className="text-center leading-tight">
            borealis.agency
            <br />
            info@borealis.biz
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Renders the contract body. Supports very light markup in templates:
 *   ## Heading     -> centered uppercase section heading
 *   ### Članak X.  -> centered bold article heading
 *   **bold** inline bold
 * Lines are otherwise justified paragraphs.
 */
function renderBody(text: string) {
  const lines = text.split("\n");
  return lines.map((raw, i) => {
    const line = raw.trimEnd();
    if (line === "") return <div key={i} className="h-3" />;
    if (line.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="mt-5 mb-3 text-center text-[11pt] font-bold uppercase tracking-wide"
        >
          {line.slice(3)}
        </h2>
      );
    }
    if (line.startsWith("### ")) {
      return (
        <h3 key={i} className="mt-3 mb-2 text-center text-[11pt] font-bold">
          {line.slice(4)}
        </h3>
      );
    }
    // inline **bold**
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p, j) =>
      p.startsWith("**") && p.endsWith("**") ? (
        <strong key={j}>{p.slice(2, -2)}</strong>
      ) : (
        <span key={j}>{p}</span>
      ),
    );
    return (
      <p
        key={i}
        className="mb-2 text-justify text-[10.5pt] leading-[1.55]"
      >
        {parts}
      </p>
    );
  });
}

export const ContractPreview = forwardRef<HTMLDivElement, Props>(
  ({ number, templateTitle, templateBody, vars }, ref) => {
    const filled = fillTemplate(templateBody, vars);
    return (
      <div
        ref={ref}
        className="contract-paper mx-auto w-full max-w-[210mm] bg-white px-[22mm] py-[20mm] shadow-sm ring-1 ring-border"
      >
        <Letterhead />

        <div className="mb-4 flex items-center justify-between text-[9pt] text-neutral-600">
          <span>Broj ugovora:</span>
          <span className="font-mono font-semibold text-[color:var(--primary)]">
            {number}
          </span>
        </div>

        <h1 className="mb-6 mt-2 text-center text-[12pt] font-bold uppercase tracking-wide">
          {templateTitle}
        </h1>

        <div className="contract-body">{renderBody(filled)}</div>

        <div className="mt-8 border-t border-neutral-300 pt-2 text-right text-[9pt] text-neutral-500">
          Borealis d.o.o. · OIB: 69433981874 · IBAN: HR8723400091110560684
        </div>
      </div>
    );
  },
);
ContractPreview.displayName = "ContractPreview";
