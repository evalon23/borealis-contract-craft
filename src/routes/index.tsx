import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { TEMPLATES } from "@/lib/templates";
import { Button } from "@/components/ui/button";
import { peekNextNumber } from "@/lib/contract";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

const accentClass: Record<string, string> = {
  red: "bg-primary",
  blue: "bg-[color:var(--brand-blue)]",
  purple: "bg-[color:var(--brand-purple)]",
  teal: "bg-[color:var(--brand-teal)]",
};

function Index() {
  const [nextNum, setNextNum] = useState("BOR-----");
  useEffect(() => setNextNum(peekNextNumber()), []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Generator ugovora
            </h1>
            <p className="mt-2 text-muted-foreground">
              Odaberite predložak ugovora za generiranje.
            </p>
          </div>
          <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
            Sljedeći broj:{" "}
            <span className="font-mono font-semibold text-primary">
              {nextNum}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {TEMPLATES.map((t) => (
            <div
              key={t.id}
              className="group relative overflow-hidden rounded-xl border bg-white p-6 transition-shadow hover:shadow-md"
            >
              <div
                className={`mb-4 inline-flex h-9 w-9 items-center justify-center rounded-md ${accentClass[t.accent]} text-white`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6M8 3h8l4 4v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">{t.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t.description}
              </p>
              <div className="mt-5">
                <Button asChild>
                  <Link to="/predlozak/$id" params={{ id: t.id }}>
                    Kreiraj ugovor
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
