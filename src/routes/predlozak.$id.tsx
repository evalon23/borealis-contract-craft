import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { ContractForm } from "@/components/ContractForm";
import { ContractPreview, type ContractPreviewHandle } from "@/components/ContractPreview";
import { Button } from "@/components/ui/button";
import { getTemplate, type TemplateId } from "@/lib/templates";
import {
  EMPTY_VARS,
  addHistory,
  consumeNextNumber,
  fillTemplate,
  loadHistory,
  peekNextNumber,
  updateHistory,
  type ContractVars,
  type HistoryEntry,
} from "@/lib/contract";
import { exportDocx, exportPdf } from "@/lib/export";
import { toast } from "sonner";

type Search = { edit?: string };

export const Route = createFileRoute("/predlozak/$id")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    edit: typeof s.edit === "string" ? s.edit : undefined,
  }),
  component: TemplatePage,
});

function TemplatePage() {
  const { id } = Route.useParams();
  const { edit } = useSearch({ from: "/predlozak/$id" }) as Search;
  const navigate = useNavigate();
  const template = getTemplate(id as TemplateId);

  const existing = useMemo<HistoryEntry | undefined>(
    () => (edit ? loadHistory().find((e) => e.id === edit) : undefined),
    [edit],
  );

  const [vars, setVars] = useState<ContractVars>(
    existing?.vars ?? EMPTY_VARS,
  );
  const [number, setNumber] = useState<string>(
    existing?.number ?? peekNextNumber(),
  );
  const [saved, setSaved] = useState<boolean>(!!existing);
  const [savedId, setSavedId] = useState<string | undefined>(existing?.id);
  const previewRef = useRef<ContractPreviewHandle>(null);

  useEffect(() => {
    if (!existing) setNumber(peekNextNumber());
  }, [existing]);

  const ensureSaved = (): HistoryEntry => {
    if (saved && savedId) {
      const entry: HistoryEntry = {
        id: savedId,
        number,
        templateId: template.id,
        templateTitle: template.title,
        partnerName: vars.PARTNER_NAME || "(bez naziva)",
        createdAt: existing?.createdAt ?? new Date().toISOString(),
        vars,
      };
      updateHistory(entry);
      return entry;
    }
    const assigned = existing ? number : consumeNextNumber();
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      number: assigned,
      templateId: template.id,
      templateTitle: template.title,
      partnerName: vars.PARTNER_NAME || "(bez naziva)",
      createdAt: new Date().toISOString(),
      vars,
    };
    addHistory(entry);
    setNumber(assigned);
    setSaved(true);
    setSavedId(entry.id);
    return entry;
  };

  const baseFilename = () =>
    `${number}_${(vars.PARTNER_NAME || "ugovor").replace(/[^\w\-]+/g, "_")}`;

  const handlePdf = async () => {
    ensureSaved();
    const el = previewRef.current?.getPrintElement();
    if (!el) return;
    try {
      await exportPdf(el, `${baseFilename()}.pdf`);
      toast.success("PDF preuzet");
    } catch {
      toast.error("Greška pri izradi PDF-a");
    }
  };

  const handleDocx = async () => {
    ensureSaved();
    try {
      const body = fillTemplate(template.body, vars);
      await exportDocx(
        { number, templateTitle: template.title, body },
        `${baseFilename()}.docx`,
      );
      toast.success("Word dokument preuzet");
    } catch {
      toast.error("Greška pri izradi Word dokumenta");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="mx-auto max-w-[1500px] px-6 py-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate({ to: "/" })}>
              ← Natrag
            </Button>
            <div>
              <h1 className="text-xl font-bold">{template.title}</h1>
              <p className="text-sm text-muted-foreground">
                Broj:{" "}
                <span className="font-mono font-semibold text-primary">
                  {number}
                </span>
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDocx}>
              Preuzmi Word (.docx)
            </Button>
            <Button onClick={handlePdf}>Preuzmi PDF</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <ContractForm vars={vars} onChange={setVars} />
          </div>
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-lg bg-neutral-100 p-4">
              <ContractPreview
                ref={previewRef}
                number={number}
                templateTitle={template.title}
                templateBody={template.body}
                vars={vars}
              />
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              A4 pregled — koristite strelice za navigaciju kroz stranice.
            </p>
            <div className="mt-4">
              <Link
                to="/povijest"
                className="text-sm text-primary underline-offset-2 hover:underline"
              >
                Pogledaj povijest ugovora →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
