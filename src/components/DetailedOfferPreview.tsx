import { forwardRef, useImperativeHandle, useRef } from "react";
import type { DetailedOfferData } from "@/lib/offer-detailed";
import { sumHours, sumExact, sumBallpark } from "@/lib/offer-detailed";
import { BRAND } from "@/lib/branding";
import { t, formatDate, formatMoney } from "@/lib/i18n";
import { Building2, MapPin, Globe } from "lucide-react";

const ICONS = { building: Building2, "map-pin": MapPin, globe: Globe } as const;

export interface DetailedOfferPreviewHandle {
  getPrintElement: () => HTMLElement | null;
}

interface Props {
  data: DetailedOfferData;
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

export const DetailedOfferPreview = forwardRef<DetailedOfferPreviewHandle, Props>(
  ({ data }, ref) => {
    const printRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => ({ getPrintElement: () => printRef.current }));

    const lang = data.lang;
    const exact = sumExact(data.exactEstimates);
    const ballpark = sumBallpark(data.ballparkEstimates);

    const milestoneTotal = data.milestones.reduce((s, m) => s + (m.amount || 0), 0);

    const Page = (
      <div
        className="contract-paper mx-auto flex flex-col bg-white shadow-sm ring-1 ring-border"
        style={{ width: "210mm", minHeight: "297mm", padding: "20mm" }}
      >
        <Letterhead />
        <div className="flex-1 pt-4 text-[10pt] leading-[1.45]">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-[8.5pt] font-bold uppercase tracking-wide text-neutral-500">
                {t("client", lang)}
              </div>
              <div className="mt-1">
                <div className="font-semibold">{data.client.name || "—"}</div>
                {data.client.address && <div>{data.client.address}</div>}
                {(data.client.city || data.client.country) && (
                  <div>{[data.client.city, data.client.country].filter(Boolean).join(", ")}</div>
                )}
                {data.client.vatId && <div>VAT ID: {data.client.vatId}</div>}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[8.5pt] font-bold uppercase tracking-wide text-neutral-500">
                {t("project_name", lang)}
              </div>
              <div className="mt-1 text-[13pt] font-semibold">{data.projectName || "—"}</div>
              <div className="mt-2 text-[8.5pt] font-bold uppercase tracking-wide text-neutral-500">
                {t("estimate_number", lang)}
              </div>
              <div className="mt-1 font-mono text-[12pt] text-[color:var(--primary)]">
                {data.number || "—"}
              </div>
              <div className="mt-1 text-[9pt] text-neutral-600">
                {formatDate(data.date, lang)}
              </div>
            </div>
          </div>

          {/* Specification */}
          {data.specification && (
            <section className="mt-6">
              <h2 className="mb-2 text-[12pt] font-bold">{t("specification", lang)}</h2>
              <div
                className="rt-content text-[10pt] leading-[1.5]"
                dangerouslySetInnerHTML={{ __html: data.specification }}
              />
            </section>
          )}

          {data.technicalImplementation && (
            <section className="mt-5">
              <h2 className="mb-2 text-[12pt] font-bold">{t("technical_implementation", lang)}</h2>
              <div
                className="rt-content text-[10pt] leading-[1.5]"
                dangerouslySetInnerHTML={{ __html: data.technicalImplementation }}
              />
            </section>
          )}

          {/* Phases */}
          <section className="mt-5">
            <h2 className="mb-2 text-[12pt] font-bold">{t("phases", lang)}</h2>

            <h3 className="mt-3 text-[10pt] font-semibold">{t("ux_ui", lang)}</h3>
            <table className="mt-1 w-full border-collapse text-[9.5pt]">
              <thead>
                <tr className="border-b border-neutral-400 text-left">
                  <th className="px-1 py-1 font-semibold">{t("phase", lang)}</th>
                  <th className="px-1 py-1 text-right font-semibold">h</th>
                </tr>
              </thead>
              <tbody>
                {data.designHours.map((r) => (
                  <tr key={r.id} className="border-b border-neutral-200">
                    <td className="px-1 py-1">{r.label}</td>
                    <td className="px-1 py-1 text-right">{r.hours}</td>
                  </tr>
                ))}
                <tr>
                  <td className="px-1 py-1 text-right font-bold">{t("total", lang)}:</td>
                  <td className="px-1 py-1 text-right font-bold">{sumHours(data.designHours)} h</td>
                </tr>
              </tbody>
            </table>

            <h3 className="mt-4 text-[10pt] font-semibold">{t("development", lang)}</h3>
            <table className="mt-1 w-full border-collapse text-[9.5pt]">
              <thead>
                <tr className="border-b border-neutral-400 text-left">
                  <th className="px-1 py-1 font-semibold">{t("phase", lang)}</th>
                  <th className="px-1 py-1 text-right font-semibold">h</th>
                </tr>
              </thead>
              <tbody>
                {data.developmentHours.map((r) => (
                  <tr key={r.id} className="border-b border-neutral-200">
                    <td className="px-1 py-1">{r.label}</td>
                    <td className="px-1 py-1 text-right">{r.hours}</td>
                  </tr>
                ))}
                <tr>
                  <td className="px-1 py-1 text-right font-bold">{t("total", lang)}:</td>
                  <td className="px-1 py-1 text-right font-bold">{sumHours(data.developmentHours)} h</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* Pricing */}
          <section className="mt-5">
            <h2 className="mb-2 text-[12pt] font-bold">{t("pricing_estimate", lang)}</h2>
            <p className="mb-2 text-[9.5pt] text-neutral-600">
              {lang === "hr"
                ? `Konačna cijena izračunava se množenjem ukupnog broja sati s jediničnom satnicom od ${data.hourlyRate.toFixed(2)} EUR.`
                : `Final price is calculated by multiplying total hours by the hourly rate of ${data.hourlyRate.toFixed(2)} EUR.`}
            </p>

            {data.exactEstimates.length > 0 && (
              <>
                <h3 className="mt-2 text-[10pt] font-semibold">{t("exact_estimates", lang)}</h3>
                <table className="mt-1 w-full border-collapse text-[9.5pt]">
                  <thead>
                    <tr className="border-b border-neutral-400 text-left">
                      <th className="px-1 py-1 font-semibold">{t("phase", lang)}</th>
                      <th className="px-1 py-1 text-right font-semibold">h</th>
                      <th className="px-1 py-1 text-right font-semibold">{t("price", lang)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.exactEstimates.map((r) => (
                      <tr key={r.id} className="border-b border-neutral-200">
                        <td className="px-1 py-1">{r.phase}</td>
                        <td className="px-1 py-1 text-right">{r.hours}</td>
                        <td className="px-1 py-1 text-right">{formatMoney(r.price, "EUR", lang)} {t("vat_excluded", lang)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="px-1 py-1 text-right font-bold">{t("total", lang)}:</td>
                      <td className="px-1 py-1 text-right font-bold">{exact.hours}</td>
                      <td className="px-1 py-1 text-right font-bold">{formatMoney(exact.price, "EUR", lang)} {t("vat_excluded", lang)}</td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}

            {data.ballparkEstimates.length > 0 && (
              <>
                <h3 className="mt-3 text-[10pt] font-semibold">{t("ballpark_estimates", lang)}</h3>
                <table className="mt-1 w-full border-collapse text-[9.5pt]">
                  <thead>
                    <tr className="border-b border-neutral-400 text-left">
                      <th className="px-1 py-1 font-semibold">{t("phase", lang)}</th>
                      <th className="px-1 py-1 text-right font-semibold">h</th>
                      <th className="px-1 py-1 text-right font-semibold">{t("price", lang)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.ballparkEstimates.map((r) => (
                      <tr key={r.id} className="border-b border-neutral-200">
                        <td className="px-1 py-1">{r.phase}</td>
                        <td className="px-1 py-1 text-right">{r.hours}</td>
                        <td className="px-1 py-1 text-right">
                          {formatMoney(r.priceMin, "EUR", lang)} – {formatMoney(r.priceMax, "EUR", lang)} {t("vat_excluded", lang)}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="px-1 py-1 text-right font-bold" colSpan={2}>{t("total", lang)}:</td>
                      <td className="px-1 py-1 text-right font-bold">
                        {formatMoney(ballpark.min, "EUR", lang)} – {formatMoney(ballpark.max, "EUR", lang)} {t("vat_excluded", lang)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}
          </section>

          {/* Delivery */}
          {data.delivery && (
            <section className="mt-5">
              <h2 className="mb-2 text-[12pt] font-bold">{t("delivery", lang)}</h2>
              <p className="text-[10pt] whitespace-pre-wrap">{data.delivery}</p>
            </section>
          )}

          {/* Milestones */}
          {data.milestones.length > 0 && (
            <section className="mt-5">
              <h2 className="mb-2 text-[12pt] font-bold">{t("payment_milestones", lang)}</h2>
              <table className="w-full border-collapse text-[9.5pt]">
                <thead>
                  <tr className="border-b border-neutral-400 text-left">
                    <th className="px-1 py-1 font-semibold">{t("phase", lang)}</th>
                    <th className="px-1 py-1 text-right font-semibold">{t("percent", lang)}</th>
                    <th className="px-1 py-1 text-right font-semibold">{t("amount", lang)}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.milestones.map((m) => (
                    <tr key={m.id} className="border-b border-neutral-200">
                      <td className="px-1 py-1">{m.label}</td>
                      <td className="px-1 py-1 text-right">{m.percent}%</td>
                      <td className="px-1 py-1 text-right">{formatMoney(m.amount, "EUR", lang)} {t("vat_excluded", lang)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="px-1 py-1 text-right font-bold" colSpan={2}>{t("total", lang)}:</td>
                    <td className="px-1 py-1 text-right font-bold">{formatMoney(milestoneTotal, "EUR", lang)} {t("vat_excluded", lang)}</td>
                  </tr>
                </tbody>
              </table>
            </section>
          )}

          {data.notes && (
            <section className="mt-5">
              <h2 className="mb-2 text-[12pt] font-bold">{t("note", lang)}</h2>
              <p className="text-[10pt] whitespace-pre-wrap">{data.notes}</p>
            </section>
          )}
        </div>
        <Footer number={data.number} />
      </div>
    );

    return (
      <div>
        <div className="w-full overflow-hidden">{Page}</div>
        <div ref={printRef} aria-hidden style={{ position: "absolute", left: -99999, top: 0, pointerEvents: "none" }}>
          {Page}
        </div>
      </div>
    );
  },
);
DetailedOfferPreview.displayName = "DetailedOfferPreview";
