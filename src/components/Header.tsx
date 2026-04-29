import { Link } from "@tanstack/react-router";
import logo from "@/assets/borealis-logo-horizontal.png";

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Borealis"
            className="h-8 w-auto"
          />
          <span className="ml-1 text-sm text-muted-foreground">
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
