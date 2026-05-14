import type { SimpleOfferData, SimpleOfferLine } from "@/lib/offer-simple";
import { lineTotal, offerTotals } from "@/lib/offer-simple";
import { t } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

interface Props {
  data: SimpleOfferData;
  onChange: (data: SimpleOfferData) => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3 rounded-lg border bg-white p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">{title}</h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{children}</div>
    </div>
  );
}

export function SimpleOfferForm({ data, onChange }: Props) {
  const lang = data.lang;
  const set = <K extends keyof SimpleOfferData>(k: K, v: SimpleOfferData[K]) =>
    onChange({ ...data, [k]: v });
  const setClient = (k: keyof SimpleOfferData["client"], v: string) =>
    onChange({ ...data, client: { ...data.client, [k]: v } });
  const setPayment = (k: keyof SimpleOfferData["payment"], v: string) =>
    onChange({ ...data, payment: { ...data.payment, [k]: v } });
  const setLine = (id: string, patch: Partial<SimpleOfferLine>) =>
    onChange({
      ...data,
      lines: data.lines.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    });
  const addLine = () =>
    onChange({
      ...data,
      lines: [
        ...data.lines,
        {
          id: crypto.randomUUID(),
          item: "",
          currency: "EUR",
          price: 0,
          qty: 1,
          unit: t("hour", lang),
          vatRate: 0,
        },
      ],
    });
  const removeLine = (id: string) =>
    onChange({ ...data, lines: data.lines.filter((l) => l.id !== id) });

  const totals = offerTotals(data);

  return (
    <div className="space-y-4">
      <Section title={t("client", lang)}>
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
      </Section>

      <Section title={t("estimate_number", lang)}>
        <div>
          <Label className="mb-1 block text-xs">{t("date_of_issue", lang)}</Label>
          <Input type="date" value={data.date} onChange={(e) => set("date", e.target.value)} />
        </div>
        <div>
          <Label className="mb-1 block text-xs">{t("payment_method", lang)}</Label>
          <Input value={data.paymentMethod} onChange={(e) => set("paymentMethod", e.target.value)} />
        </div>
      </Section>

      <div className="space-y-3 rounded-lg border bg-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">
            {t("item", lang)}
          </h3>
          <Button size="sm" variant="outline" onClick={addLine}>
            <Plus className="mr-1 h-4 w-4" /> {t("add_item", lang)}
          </Button>
        </div>
        <div className="space-y-3">
          {data.lines.map((l, i) => (
            <div key={l.id} className="rounded-md border p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">#{i + 1}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeLine(l.id)}
                  disabled={data.lines.length === 1}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-12">
                <div className="md:col-span-12">
                  <Label className="mb-1 block text-xs">{t("description", lang)}</Label>
                  <Textarea rows={2} value={l.item} onChange={(e) => setLine(l.id, { item: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <Label className="mb-1 block text-xs">{t("currency", lang)}</Label>
                  <Input value={l.currency} onChange={(e) => setLine(l.id, { currency: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <Label className="mb-1 block text-xs">{t("price", lang)}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={l.price}
                    onChange={(e) => setLine(l.id, { price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="mb-1 block text-xs">{t("qty", lang)}</Label>
                  <Input
                    type="number"
                    step="1"
                    value={l.qty}
                    onChange={(e) => setLine(l.id, { qty: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="mb-1 block text-xs">{t("unit", lang)}</Label>
                  <Input value={l.unit} onChange={(e) => setLine(l.id, { unit: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <Label className="mb-1 block text-xs">{t("vat", lang)} %</Label>
                  <Input
                    type="number"
                    step="1"
                    value={l.vatRate}
                    onChange={(e) => setLine(l.id, { vatRate: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label className="mb-1 block text-xs">{t("total", lang)}</Label>
                  <Input value={lineTotal(l).toFixed(2)} disabled />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-6 border-t pt-3 text-sm">
          <div>
            {t("subtotal", lang)}: <strong>{totals.subtotal.toFixed(2)} €</strong>
          </div>
          <div>
            {t("vat", lang)}: <strong>{totals.vat.toFixed(2)} €</strong>
          </div>
          <div>
            {t("total", lang)}: <strong className="text-primary">{totals.total.toFixed(2)} €</strong>
          </div>
        </div>
      </div>

      <Section title={t("payment_information", lang)}>
        <div className="md:col-span-2">
          <Label className="mb-1 block text-xs">{t("iban", lang)}</Label>
          <Input value={data.payment.iban} onChange={(e) => setPayment("iban", e.target.value)} />
        </div>
        <div>
          <Label className="mb-1 block text-xs">{t("swift", lang)}</Label>
          <Input value={data.payment.swift} onChange={(e) => setPayment("swift", e.target.value)} />
        </div>
        <div>
          <Label className="mb-1 block text-xs">{t("reference_number", lang)}</Label>
          <Input value={data.payment.reference} onChange={(e) => setPayment("reference", e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <Label className="mb-1 block text-xs">{t("payment_note", lang)}</Label>
          <Input value={data.payment.note} onChange={(e) => setPayment("note", e.target.value)} />
        </div>
      </Section>

      <Section title={t("note", lang)}>
        <div className="md:col-span-2">
          <Textarea rows={3} value={data.note} onChange={(e) => set("note", e.target.value)} />
        </div>
      </Section>
    </div>
  );
}
