import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { TEMPLATES } from "@/lib/templates";
import { Button } from "@/components/ui/button";
import { peekNextNumber } from "@/lib/contract";
import { useEffect, useState } from "react";
import { APP_NAME } from "@/lib/branding";
import { FileText, Receipt, FileStack } from "lucide-react";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const [nextNum, setNextNum] = useState("…");
  useEffect(() => setNextNum(peekNextNumber()), []);

  const cards = [
    {
      icon: FileText,
      title: "Ugovor o izradi",
      desc: "Ugovor za izradu web stranice, aplikacije, dizajna ili održavanja. Bira se vrsta unutar predloška.",
      to: "/predlozak/$id",
      params: { id: TEMPLATES[0].id },
      color: "bg-primary",
    },
    {
      icon: Receipt,
      title: "Jednostavna ponuda",
      desc: "Brza ponuda po stavkama (item, qty, price, total) — kao za poznate projekte.",
      to: "/ponuda-jednostavna",
      params: undefined,
      color: "bg-[color:var(--brand-blue)]",
    },
    {
      icon: FileStack,
      title: "Detaljna ponuda",
      desc: "Opširna ponuda sa specifikacijom, fazama, exact i ballpark procjenama.",
      to: "/ponuda-detaljna",
      params: undefined,
      color: "bg-[color:var(--brand-purple)]",
    },
  ] as const;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{APP_NAME}</h1>
            <p className="mt-2 text-muted-foreground">
              Odaberi vrstu dokumenta za izradu.
            </p>
          </div>
          <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
            Sljedeći broj:{" "}
            <span className="font-mono font-semibold text-primary">{nextNum}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="group rounded-xl border bg-white p-6 transition-shadow hover:shadow-md">
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md ${c.color} text-white`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">{c.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
                <div className="mt-5">
                  <Button asChild>
                    {c.params ? (
                      <Link to={c.to} params={c.params}>Kreiraj</Link>
                    ) : (
                      <Link to={c.to}>Kreiraj</Link>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
