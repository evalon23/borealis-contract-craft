import type { Lang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

interface Props {
  value: Lang;
  onChange: (lang: Lang) => void;
}

export function LanguageToggle({ value, onChange }: Props) {
  return (
    <div className="inline-flex overflow-hidden rounded-md border bg-white">
      {(["hr", "en"] as const).map((l) => (
        <Button
          key={l}
          type="button"
          size="sm"
          variant={value === l ? "default" : "ghost"}
          className="rounded-none px-3"
          onClick={() => onChange(l)}
        >
          {l.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}
