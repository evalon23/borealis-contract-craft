import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { SimpleOfferForm } from "@/components/SimpleOfferForm";
import { SimpleOfferPreview, type SimpleOfferPreviewHandle } from "@/components/SimpleOfferPreview";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";
import {
  addHistory, consumeNextNumber, loadHistory, peekNextNumber, updateHistory,
  type HistoryEntry,
} from "@/lib/contract";
import { emptySimpleOffer, type SimpleOfferData } from "@/lib/offer-simple";
import { exportSimpleOfferDocx, exportSimpleOfferDocxBlob, printElement } from "@/lib/offer-export";
import { uploadToDrive } from "@/server/drive.functions";
import { BRAND } from "@/lib/branding";
import { t, type Lang } from "@/lib/i18n";
import { toast } from "sonner";

type Search = { edit?: string };

export const Route = createFileRoute("/ponuda-jednostavna")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    edit: typeof s.edit === "string" ? s.edit : undefined,
  }),
  component: Page,
});

function Page() {
  const { edit } = useSearch({ from: "/ponuda-jednostavna" }) as Search;
  const navigate = useNavigate();
  const existing = useMemo<HistoryEntry | undefined>(
    () => (edit ? loadHistory().find((e) => e.id === edit) : undefined),
    [edit],
  );

  const [lang, setLang] = useState<Lang>(existing?.lang ?? "hr");
  const [data, setData] = useState<SimpleOfferData>(
    (existing?.payload as SimpleOfferData | undefined) ?? emptySimpleOffer("hr"),
  );
  const [savedId, setSavedId] = useState<string | undefined>(existing?.id);
  const previewRef = useRef<SimpleOfferPreviewHandle>(null);

  useEffect(() => {
    if (!existing && !data.number) {
      setData((d) => ({ ...d, number: peekNextNumber() }));
    }
  }, [existing, data.number]);

  // Keep data.lang in sync with toggle
  useEffect(() => {
    setData((d) => ({ ...d, lang }));
  }, [lang]);

  const ensureSaved = (): HistoryEntry => {
    const number = data.number || peekNextNumber();
    if (savedId) {
      const entry: HistoryEntry = {
        id: savedId, number, kind: "offer-simple", lang,
        templateTitle: t("kind_offer_simple", lang),
        partnerName: data.client.name || "(no name)",
        createdAt: existing?.createdAt ?? new Date().toISOString(),
        payload: data,
      };
      updateHistory(entry);
      return entry;
    }
    const assigned = data.number || consumeNextNumber();
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      number: assigned, kind: "offer-simple", lang,
      templateTitle: t("kind_offer_simple", lang),
      partnerName: data.client.name || "(no name)",
      createdAt: new Date().toISOString(),
      payload: { ...data, number: assigned },
    };
    addHistory(entry);
    setSavedId(entry.id);
    setData((d) => ({ ...d, number: assigned }));
    return entry;
  };

  const baseFilename = () =>
    `${data.number || "ponuda"}_${(data.client.name || "klijent").replace(/[^\w\-]+/g, "_")}_offer_${lang}`;

  const blobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res((r.result as string).split(",")[1] ?? "");
      r.onerror = () => rej(r.error);
      r.readAsDataURL(blob);
    });

  const upload = async (blob: Blob, filename: string, mime: string) => {
    try {
      const contentBase64 = await blobToBase64(blob);
      await uploadToDrive({ data: { filename, mimeType: mime, contentBase64, folderId: BRAND.driveFolderId } });
      toast.success(`${filename} → Drive`);
    } catch (e) {
      console.error(e);
      toast.error(t("drive_failed", lang));
    }
  };

  const handlePdf = async () => {
    ensureSaved();
    const el = previewRef.current?.getPrintElement();
    if (!el) return;
    try {
      await printElement(el, `${baseFilename()}.pdf`, lang);
      toast.success(t("open_print", lang));
    } catch (e) {
      console.error(e);
      toast.error("Greška");
    }
  };

  const handleDocx = async () => {
    ensureSaved();
    const filename = `${baseFilename()}.docx`;
    try {
      const blob = await exportSimpleOfferDocxBlob(data);
      await exportSimpleOfferDocx(data, filename);
      toast.success(t("word_downloaded", lang));
      void upload(blob, filename, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    } catch (e) {
      console.error(e);
      toast.error("Greška");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="mx-auto max-w-[1500px] px-6 py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate({ to: "/" })}>← {t("back", lang)}</Button>
            <div>
              <h1 className="text-xl font-bold">{t("kind_offer_simple", lang)}</h1>
              <p className="text-sm text-muted-foreground">
                {t("number", lang)}:{" "}
                <span className="font-mono font-semibold text-primary">{data.number || "…"}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle value={lang} onChange={setLang} />
            <Button variant="outline" onClick={handleDocx}>{t("download_word", lang)}</Button>
            <Button onClick={handlePdf}>{t("download_pdf", lang)}</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-4"><SimpleOfferForm data={data} onChange={setData} /></div>
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-lg bg-neutral-100 p-4 overflow-auto max-h-[85vh]">
              <SimpleOfferPreview ref={previewRef} data={data} />
            </div>
            <div className="mt-4">
              <Link to="/povijest" className="text-sm text-primary hover:underline">
                Pogledaj povijest →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
