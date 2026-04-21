import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-primary" />
          <span className="text-xl font-bold tracking-tight text-foreground">
            Borealis
          </span>
          <span className="ml-2 text-sm text-muted-foreground">
            Generator ugovora
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            to="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-muted" }}
          >
            Predlošci
          </Link>
          <Link
            to="/povijest"
            className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            activeProps={{ className: "bg-muted" }}
          >
            Povijest
          </Link>
        </nav>
      </div>
    </header>
  );
}
