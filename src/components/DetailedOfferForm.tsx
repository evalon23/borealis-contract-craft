import type {
  DetailedOfferData,
  PhaseHourRow,
  ExactEstimateRow,
  BallparkEstimateRow,
  MilestoneRow,
} from "@/lib/offer-detailed";
import { t } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  data: DetailedOfferData;
  onChange: (d: DetailedOfferData) => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 rounded-lg border bg-white p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">{title}</h3>
      {children}
    </div>
  );
}

export function DetailedOfferForm({ data, onChange }: Props) {
  const lang = data.lang;
  const set = <K extends keyof DetailedOfferData>(k: K, v: DetailedOfferData[K]) =>
    onChange({ ...data, [k]: v });
  const setClient = (k: keyof DetailedOfferData["client"], v: string) =>
    onChange({ ...data, client: { ...data.client, [k]: v } });

  const phaseRowsEditor = <T extends { id: string }>(
    rows: T[],
    cols: Array<{ key: keyof T; label: string; type?: string; width?: string }>,
    setter: (next: T[]) => void,
    makeNew: () => T,
  ) => (
    <div className="space-y-2">
      {rows.map((r, i) => (
        <div key={r.id} className="flex items-end gap-2">
          <span className="w-6 text-xs text-muted-foreground">{i + 1}.</span>
          {cols.map((c) => (
            <div key={String(c.key)} className={c.width ?? "flex-1"}>
              <Label className="mb-1 block text-xs">{c.label}</Label>
              <Input
                type={c.type ?? "text"}
                value={(r[c.key] as unknown as string | number) ?? ""}
                onChange={(e) => {
                  const v = c.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value;
                  setter(rows.map((x) => (x.id === r.id ? { ...x, [c.key]: v } : x)));
                }}
              />
            </div>
          ))}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setter(rows.filter((x) => x.id !== r.id))}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button size="sm" variant="outline" onClick={() => setter([...rows, makeNew()])}>
        <Plus className="mr-1 h-4 w-4" /> {t("add_item", lang)}
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <Section title={t("client", lang)}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label className="mb-1 block text-xs">{t("client_name", lang)}</Label>
            <Input value={data.client.name} onChange={(e) => setClient("name", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label className="mb-1 block text-xs">{t("client_address", lang)}</Label>
            <Input value={data.client.address} onChange={(e) => setClient("address", e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block text-xs">{t("client_city", lang)}</Label>
            <Input value={data.client.city} onChange={(e) => setClient("city", e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block text-xs">{t("client_country", lang)}</Label>
            <Input value={data.client.country} onChange={(e) => setClient("country", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label className="mb-1 block text-xs">{t("client_vat_id", lang)}</Label>
            <Input value={data.client.vatId} onChange={(e) => setClient("vatId", e.target.value)} />
          </div>
        </div>
      </Section>

      <Section title={t("project_name", lang)}>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label className="mb-1 block text-xs">{t("project_name", lang)}</Label>
            <Input value={data.projectName} onChange={(e) => set("projectName", e.target.value)} />
          </div>
          <div>
            <Label className="mb-1 block text-xs">{t("date_of_issue", lang)}</Label>
            <Input type="date" value={data.date} onChange={(e) => set("date", e.target.value)} />
          </div>
        </div>
      </Section>

      <Section title={t("specification", lang)}>
        <RichTextEditor value={data.specification} onChange={(v) => set("specification", v)} rows={6} />
      </Section>

      <Section title={t("technical_implementation", lang)}>
        <RichTextEditor value={data.technicalImplementation} onChange={(v) => set("technicalImplementation", v)} rows={5} />
      </Section>

      <Section title={`${t("phases", lang)} — ${t("ux_ui", lang)}`}>
        {phaseRowsEditor<PhaseHourRow>(
          data.designHours,
          [
            { key: "label", label: t("phase", lang) },
            { key: "hours", label: "h", type: "number", width: "w-24" },
          ],
          (next) => set("designHours", next),
          () => ({ id: crypto.randomUUID(), label: "", hours: 0 }),
        )}
      </Section>

      <Section title={`${t("phases", lang)} — ${t("development", lang)}`}>
        {phaseRowsEditor<PhaseHourRow>(
          data.developmentHours,
          [
            { key: "label", label: t("phase", lang) },
            { key: "hours", label: "h", type: "number", width: "w-24" },
          ],
          (next) => set("developmentHours", next),
          () => ({ id: crypto.randomUUID(), label: "", hours: 0 }),
        )}
      </Section>

      <Section title={t("pricing_estimate", lang)}>
        <div className="mb-3">
          <Label className="mb-1 block text-xs">EUR / h</Label>
          <Input
            type="number"
            value={data.hourlyRate}
            onChange={(e) => set("hourlyRate", parseFloat(e.target.value) || 0)}
            className="w-32"
          />
        </div>
        <h4 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
          {t("exact_estimates", lang)}
        </h4>
        {phaseRowsEditor<ExactEstimateRow>(
          data.exactEstimates,
          [
            { key: "phase", label: t("phase", lang) },
            { key: "hours", label: "h", type: "number", width: "w-20" },
            { key: "price", label: "EUR", type: "number", width: "w-28" },
          ],
          (next) => set("exactEstimates", next),
          () => ({ id: crypto.randomUUID(), phase: "", hours: 0, price: 0 }),
        )}
        <h4 className="mb-2 mt-4 text-xs font-semibold uppercase text-muted-foreground">
          {t("ballpark_estimates", lang)}
        </h4>
        {phaseRowsEditor<BallparkEstimateRow>(
          data.ballparkEstimates,
          [
            { key: "phase", label: t("phase", lang) },
            { key: "hours", label: "h", width: "w-24" },
            { key: "priceMin", label: "min EUR", type: "number", width: "w-24" },
            { key: "priceMax", label: "max EUR", type: "number", width: "w-24" },
          ],
          (next) => set("ballparkEstimates", next),
          () => ({ id: crypto.randomUUID(), phase: "", hours: "", priceMin: 0, priceMax: 0 }),
        )}
      </Section>

      <Section title={t("delivery", lang)}>
        <Textarea rows={3} value={data.delivery} onChange={(e) => set("delivery", e.target.value)} />
      </Section>

      <Section title={t("payment_milestones", lang)}>
        {phaseRowsEditor<MilestoneRow>(
          data.milestones,
          [
            { key: "label", label: t("phase", lang) },
            { key: "percent", label: "%", type: "number", width: "w-20" },
            { key: "amount", label: "EUR", type: "number", width: "w-28" },
          ],
          (next) => set("milestones", next),
          () => ({ id: crypto.randomUUID(), label: "", percent: 0, amount: 0 }),
        )}
      </Section>

      <Section title={t("note", lang)}>
        <Textarea rows={3} value={data.notes} onChange={(e) => set("notes", e.target.value)} />
      </Section>
    </div>
  );
}
