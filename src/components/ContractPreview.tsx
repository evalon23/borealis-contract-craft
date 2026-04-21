import { forwardRef } from "react";
import type { ContractVars } from "@/lib/contract";
import { fillTemplate } from "@/lib/contract";

interface Props {
  number: string;
  templateTitle: string;
  templateBody: string;
  vars: ContractVars;
}

export const ContractPreview = forwardRef<HTMLDivElement, Props>(
  ({ number, templateTitle, templateBody, vars }, ref) => {
    const filled = fillTemplate(templateBody, vars);
    return (
      <div
        ref={ref}
        className="contract-paper mx-auto w-full max-w-[210mm] p-[20mm] shadow-sm ring-1 ring-border"
      >
        <div className="mb-6 border-b border-neutral-300 pb-4">
          <div className="text-lg font-bold" style={{ color: "#E63329" }}>
            Borealis d.o.o.
          </div>
          <div className="text-sm text-neutral-700">
            Ljutomerska ulica 7, 10 000 Zagreb
          </div>
          <div className="text-sm text-neutral-700">OIB: 69433981874</div>
          <div className="text-sm text-neutral-700">
            IBAN: HR8723400091110560684, Privredna banka Zagreb
          </div>
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold uppercase tracking-wide">
            {templateTitle}
          </h1>
          <div className="mt-2 inline-block rounded border border-neutral-400 px-3 py-1 font-mono text-sm font-bold">
            Broj ugovora: {number}
          </div>
        </div>

        <div className="contract-body text-[11pt] leading-relaxed">
          {filled}
        </div>
      </div>
    );
  },
);
ContractPreview.displayName = "ContractPreview";
