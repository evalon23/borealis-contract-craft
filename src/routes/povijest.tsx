import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { loadHistory, removeHistory, type HistoryEntry } from "@/lib/contract";
import { TEMPLATES } from "@/lib/templates";

export const Route = createFileRoute("/povijest")({
  component: HistoryPage,
});

function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setEntries(loadHistory());
  }, []);

  const handleDelete = (id: string) => {
    if (!confirm("Obrisati ovaj ugovor iz povijesti?")) return;
    removeHistory(id);
    setEntries(loadHistory());
  };

  const templateLabel = (id: string) =>
    TEMPLATES.find((t) => t.id === id)?.title ?? id;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Povijest ugovora
            </h1>
            <p className="mt-1 text-muted-foreground">
              Pregled svih generiranih ugovora.
            </p>
          </div>
          <div className="rounded-md border bg-muted/30 px-3 py-2 text-sm">
            Ukupno:{" "}
            <span className="font-semibold text-primary">{entries.length}</span>
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
            Nema generiranih ugovora.
            <div className="mt-3">
              <Button asChild>
                <Link to="/">Kreiraj prvi ugovor</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Broj</th>
                  <th className="px-4 py-3 font-semibold">Partner</th>
                  <th className="px-4 py-3 font-semibold">Predložak</th>
                  <th className="px-4 py-3 font-semibold">Datum</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => (
                  <tr key={e.id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono font-semibold text-primary">
                      {e.number}
                    </td>
                    <td className="px-4 py-3">{e.partnerName}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {templateLabel(e.templateId)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(e.createdAt).toLocaleDateString("hr-HR")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link
                            to="/predlozak/$id"
                            params={{ id: e.templateId }}
                            search={{ edit: e.id }}
                          >
                            Otvori
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(e.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          Obriši
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
