import type { ContractVars } from "@/lib/contract";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/RichTextEditor";

interface Props {
  vars: ContractVars;
  onChange: (next: ContractVars) => void;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3 rounded-lg border bg-white p-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">
        {title}
      </h3>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{children}</div>
    </div>
  );
}

export function ContractForm({ vars, onChange }: Props) {
  const set = <K extends keyof ContractVars>(k: K, v: ContractVars[K]) =>
    onChange({ ...vars, [k]: v });

  const field = (
    key: keyof ContractVars,
    label: string,
    opts: {
      type?: string;
      textarea?: boolean;
      rich?: boolean;
      full?: boolean;
      rows?: number;
    } = {},
  ) => (
    <div className={opts.full ? "md:col-span-2" : undefined}>
      <Label className="mb-1 block text-xs font-medium text-neutral-700">
        {label}
      </Label>
      {opts.rich ? (
        <RichTextEditor
          value={vars[key]}
          onChange={(html) => set(key, html)}
          rows={opts.rows ?? 4}
        />
      ) : opts.textarea ? (
        <Textarea
          rows={opts.rows ?? 3}
          value={vars[key]}
          onChange={(e) => set(key, e.target.value)}
        />
      ) : (
        <Input
          type={opts.type ?? "text"}
          value={vars[key]}
          onChange={(e) => set(key, e.target.value)}
        />
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <Section title="Podaci o partneru">
        {field("PARTNER_NAME", "Naziv tvrtke/ustanove", { full: true })}
        {field("PARTNER_CITY", "Grad")}
        {field("PARTNER_ADDRESS", "Adresa")}
        {field("PARTNER_OIB", "OIB")}
        {field("PARTNER_REP", "Ime zastupnika")}
        {field("PARTNER_REP_TITLE", "Titula zastupnika", { full: true })}
      </Section>

      <Section title="Projekt">
        {field("PROJECT_NAME", "Naziv projekta", { full: true })}
        {field("PROJECT_SCOPE", "Opis predmeta ugovora", {
          rich: true,
          full: true,
          rows: 4,
        })}
        {field("SERVICE_LIST", "Lista usluga", {
          rich: true,
          full: true,
          rows: 6,
        })}
      </Section>

      <Section title="Financije">
        {field("CONTRACT_VALUE", "Ukupna vrijednost ugovora (EUR)")}
        {field("BUDGET_EUR", "Godišnji budžet (EUR)")}
        {field("BUDGET_HOURS", "Broj godišnjih sati")}
        {field("HOURLY_RATE_REGULAR", "Satnica – redovno (EUR/h)")}
        {field("HOURLY_RATE_OVERTIME", "Satnica – izvan radnog vremena (EUR/h)")}
        {field("PAYMENT_TERMS", "Uvjeti plaćanja", {
          textarea: true,
          full: true,
          rows: 3,
        })}
      </Section>

      <Section title="Rokovi">
        {field("START_DATE", "Datum početka", { type: "date" })}
        {field("DEADLINE", "Rok isporuke")}
      </Section>

      <Section title="Ostalo">
        {field("SPECIAL_CONDITIONS", "Posebni uvjeti / napomene", {
          rich: true,
          full: true,
          rows: 3,
        })}
      </Section>

      <Section title="Potpis">
        {field("SIGN_DATE", "Datum potpisivanja", { type: "date" })}
        {field("BOREALIS_REP", "Ime zastupnika Borealis")}
      </Section>
    </div>
  );
}
