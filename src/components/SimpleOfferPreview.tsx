import { forwardRef, useImperativeHandle, useRef } from "react";
import type { SimpleOfferData } from "@/lib/offer-simple";
import { lineTotal, offerTotals } from "@/lib/offer-simple";
import { BRAND } from "@/lib/branding";
import { t, formatDate, formatMoney } from "@/lib/i18n";
import { Building2, MapPin, Globe } from "lucide-react";

const ICONS = { building: Building2, "map-pin": MapPin, globe: Globe } as const;

export interface SimpleOfferPreviewHandle {
  getPrintElement: () => HTMLElement | null;
}

interface Props {
  data: SimpleOfferData;
}

function Letterhead() {
  return (
    <div className="border-b border-neutral-300 pb-3">
      <div className="flex items-start justify-between gap-6">
        <img
          src={BRAND.headerImage}
          alt="Borealis"
          style={{ height: "36px", width: "auto", maxWidth: "46%", objectFit: "contain", display: "block", flexShrink: 0 }}
        />
        <div className="grid flex-1 grid-cols-3 gap-4 text-right text-[8.5pt] leading-[1.15] text-neutral-700">
          {BRAND.headerDetails.map((it) => {
            const Icon = ICONS[it.icon];
            return (
              <div key={it.title} className="flex items-start justify-end gap-1.5">
                <div>
                  <div className="font-semibold text-neutral-900">{it.title}</div>
                  {it.lines.map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </div>
                <Icon className="mt-0.5 h-3 w-3 shrink-0 text-[color:var(--primary)]" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Footer({ number }: { number: string }) {
  return (
    <div className="mt-auto flex items-center justify-between border-t border-neutral-300 pt-4 text-[7.5pt] text-neutral-500">
      <span>{BRAND.footerLine}</span>
      <span>
        № <span className="font-mono text-[color:var(--primary)]">{number}</span>
      </span>
    </div>
  );
}

export const SimpleOfferPreview = forwardRef<SimpleOfferPreviewHandle, Props>(
  ({ data }, ref) => {
    const printRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => ({ getPrintElement: () => printRef.current }));

    const lang = data.lang;
    const totals = offerTotals(data);
    const hasVat = data.lines.some((l) => l.vatRate > 0);

    const Page = (
      <div
        className="contract-paper mx-auto flex flex-col bg-white shadow-sm ring-1 ring-border"
        style={{ width: "210mm", minHeight: "297mm", padding: "20mm" }}
      >
        <Letterhead />
        <div className="flex-1 pt-4 text-[10pt] leading-[1.4]">
          {/* Client + meta block */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-[8.5pt] font-bold uppercase tracking-wide text-neutral-500">
                {t("client", lang)}
              </div>
              <div className="mt-1">
                <div className="font-semibold">{data.client.name || "—"}</div>
                {data.client.address && <div>{data.client.address}</div>}
                {(data.client.city || data.client.country) && (
                  <div>
                    {[data.client.city, data.client.country].filter(Boolean).join(", ")}
                  </div>
                )}
                {data.client.vatId && <div>VAT ID: {data.client.vatId}</div>}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[8.5pt] font-bold uppercase tracking-wide text-neutral-500">
                {t("estimate_number", lang)}
              </div>
              <div className="mt-1 font-mono text-[14pt] font-semibold text-[color:var(--primary)]">
                {data.number || "—"}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-between text-[9pt]">
            <div>
              <span className="font-semibold">{t("payment_method", lang)}:</span>{" "}
              {data.paymentMethod}
            </div>
            <div>
              <span className="font-semibold">{t("date_of_issue", lang)}:</span>{" "}
              {formatDate(data.date, lang)}
            </div>
          </div>

          {/* Items table */}
          <table className="mt-5 w-full border-collapse text-[9pt]">
            <thead>
              <tr className="border-b border-neutral-400 text-left text-neutral-600">
                <th className="px-1 py-2 font-semibold">№</th>
                <th className="px-1 py-2 font-semibold">{t("item", lang)}</th>
                <th className="px-1 py-2 text-right font-semibold">{t("currency", lang)}</th>
                <th className="px-1 py-2 text-right font-semibold">{t("price", lang)}</th>
                <th className="px-1 py-2 text-right font-semibold">{t("qty", lang)}</th>
                <th className="px-1 py-2 font-semibold">{t("unit", lang)}</th>
                <th className="px-1 py-2 text-right font-semibold">{t("total", lang)}</th>
                <th className="px-1 py-2 text-right font-semibold">{t("vat", lang)}</th>
              </tr>
            </thead>
            <tbody>
              {data.lines.map((l, i) => (
                <tr key={l.id} className="border-b border-neutral-200">
                  <td className="px-1 py-2 align-top">{i + 1}</td>
                  <td className="px-1 py-2 align-top whitespace-pre-wrap">{l.item || "—"}</td>
                  <td className="px-1 py-2 text-right align-top">{l.currency}</td>
                  <td className="px-1 py-2 text-right align-top">{l.price.toFixed(2)}</td>
                  <td className="px-1 py-2 text-right align-top">{l.qty}</td>
                  <td className="px-1 py-2 align-top">{l.unit}</td>
                  <td className="px-1 py-2 text-right align-top">{lineTotal(l).toFixed(2)}</td>
                  <td className="px-1 py-2 text-right align-top">
                    {l.vatRate > 0 ? `${l.vatRate}%` : "—"}
                  </td>
                </tr>
              ))}
              <tr className="text-[9pt]">
                <td colSpan={6} />
                <td className="px-1 py-2 text-right font-semibold">{t("subtotal", lang)}:</td>
                <td className="px-1 py-2 text-right">{formatMoney(totals.subtotal, "EUR", lang)}</td>
              </tr>
              {hasVat && (
                <tr>
                  <td colSpan={6} />
                  <td className="px-1 py-2 text-right font-semibold">{t("vat", lang)}:</td>
                  <td className="px-1 py-2 text-right">{formatMoney(totals.vat, "EUR", lang)}</td>
                </tr>
              )}
              <tr className="border-t border-neutral-400 text-[10pt]">
                <td colSpan={6} />
                <td className="px-1 py-2 text-right font-bold">{t("total", lang)}:</td>
                <td className="px-1 py-2 text-right font-bold">{formatMoney(totals.total, "EUR", lang)}</td>
              </tr>
            </tbody>
          </table>

          {/* Payment info */}
          <div className="mt-6 grid grid-cols-2 gap-6 text-[9pt]">
            <div>
              <div className="font-bold">{t("payment_information", lang)}</div>
              <div className="mt-1 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
                <span className="font-semibold">{t("iban", lang)}:</span>
                <span>{data.payment.iban}</span>
                <span className="font-semibold">{t("swift", lang)}:</span>
                <span>{data.payment.swift}</span>
                {data.payment.note && (
                  <>
                    <span className="font-semibold">{t("payment_note", lang)}:</span>
                    <span>{data.payment.note}</span>
                  </>
                )}
                {data.payment.reference && (
                  <>
                    <span className="font-semibold">{t("reference_number", lang)}:</span>
                    <span>{data.payment.reference}</span>
                  </>
                )}
              </div>
            </div>
            {data.note && (
              <div>
                <div className="font-bold">{t("note", lang)}</div>
                <div className="mt-1 whitespace-pre-wrap">{data.note}</div>
              </div>
            )}
          </div>
        </div>
        <Footer number={data.number} />
      </div>
    );

    return (
      <div>
        <div className="w-full overflow-hidden">
          <div style={{ transform: "scale(var(--paper-scale, 1))", transformOrigin: "top left" }}>
            {Page}
          </div>
        </div>
        <div ref={printRef} aria-hidden style={{ position: "absolute", left: -99999, top: 0, pointerEvents: "none" }}>
          {Page}
        </div>
      </div>
    );
  },
);
SimpleOfferPreview.displayName = "SimpleOfferPreview";
