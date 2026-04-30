import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ContractVars } from "@/lib/contract";
import { fillTemplate } from "@/lib/contract";
import { BRAND } from "@/lib/branding";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Building2, MapPin, Globe } from "lucide-react";

const ICONS = {
  building: Building2,
  "map-pin": MapPin,
  globe: Globe,
} as const;

interface Props {
  number: string;
  templateTitle: string;
  templateBody: string;
  vars: ContractVars;
}

export interface ContractPreviewHandle {
  /** Returns an off-screen element containing ALL pages stacked, for PDF export. */
  getPrintElement: () => HTMLElement | null;
}

// A4 at 96dpi: 210mm x 297mm -> ~794 x 1123 px. We use mm in CSS so print is 1:1.
const PAGE_HEIGHT_MM = 297;
const PAGE_MARGIN_MM = 20; // top/bottom
const HEADER_RESERVE_MM = 22; // header strip + gap
const FOOTER_RESERVE_MM = 10; // footer line
const CONTENT_HEIGHT_MM =
  PAGE_HEIGHT_MM - 2 * PAGE_MARGIN_MM - HEADER_RESERVE_MM - FOOTER_RESERVE_MM;

// Approx px-per-mm at our rendered scale (we render in mm via CSS -> 1mm ≈ 3.78px @ 96dpi)
const MM_PER_PX = 1 / 3.7795;

// ------- Block model -------
type Block =
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "p"; text: string }
  | { kind: "html"; html: string }
  | { kind: "spacer" }
  | { kind: "signature" };

/** Inline **bold** parser for plain-text lines. */
function inlineBold(line: string): ReactNode[] {
  return line.split(/(\*\*[^*]+\*\*)/g).map((p, j) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={j}>{p.slice(2, -2)}</strong>
    ) : (
      <span key={j}>{p}</span>
    ),
  );
}

/** Parse the filled template into an ordered list of blocks. */
function parseBlocks(filled: string): Block[] {
  const blocks: Block[] = [];
  const lines = filled.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd();
    if (line === "") {
      blocks.push({ kind: "spacer" });
      continue;
    }
    if (line === "@@SIGNATURE@@") {
      blocks.push({ kind: "signature" });
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ kind: "h2", text: line.slice(3) });
      continue;
    }
    if (line.startsWith("### ")) {
      blocks.push({ kind: "h3", text: line.slice(4) });
      continue;
    }
    // A line may contain HTML (from rich editor). Detect any block-level tag.
    if (/<(p|ul|ol|h[1-6]|li|div|br)\b/i.test(line) || /^<\w+/.test(line)) {
      blocks.push({ kind: "html", html: line });
      continue;
    }
    blocks.push({ kind: "p", text: line });
  }
  return blocks;
}

function BlockView({ block, vars }: { block: Block; vars: ContractVars }) {
  switch (block.kind) {
    case "h2":
      return (
        <h2 className="mt-4 mb-2 text-center text-[12pt] font-bold uppercase tracking-wide">
          {block.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="mt-3 mb-2 text-center text-[11pt] font-bold">
          {block.text}
        </h3>
      );
    case "p":
      return (
        <p className="mb-2 text-justify text-[11pt] leading-[1.5]">
          {inlineBold(block.text)}
        </p>
      );
    case "html":
      return (
        <div
          className="rt-content mb-2 text-[11pt] leading-[1.5]"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      );
    case "spacer":
      return <div className="h-2" />;
    case "signature":
      return <SignatureBlock vars={vars} />;
  }
}

function SignatureBlock({ vars }: { vars: ContractVars }) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-10 text-[11pt]">
      <div>
        <div className="mb-1 font-bold">NARUČITELJ:</div>
        <div className="mt-10 border-t border-neutral-800 pt-1">
          {vars.PARTNER_REP || "\u00A0"}
          {vars.PARTNER_REP_TITLE ? `, ${vars.PARTNER_REP_TITLE}` : ""}
        </div>
        <div className="text-[10pt] text-neutral-600">
          {vars.PARTNER_NAME}
        </div>
      </div>
      <div>
        <div className="mb-1 font-bold">IZVOĐAČ:</div>
        <div className="mt-10 border-t border-neutral-800 pt-1">
          {vars.BOREALIS_REP || "Dennis Puzak"}, Direktor
        </div>
        <div className="text-[10pt] text-neutral-600">Borealis d.o.o.</div>
      </div>
    </div>
  );
}

function Letterhead() {
  return (
    <div className="border-b border-neutral-300 pb-3">
      <div className="flex items-start justify-between gap-6">
        <img
          src={BRAND.headerImage}
          alt="Borealis"
          style={{
            height: "36px",
            width: "auto",
            maxWidth: "46%",
            objectFit: "contain",
            display: "block",
            flexShrink: 0,
          }}
        />
        <div className="grid flex-1 grid-cols-3 gap-4 text-right text-[8.5pt] leading-[1.15] text-neutral-700">
          {BRAND.headerDetails.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <div key={item.title} className="flex items-start justify-end gap-1.5">
                <div>
                  <div className="font-semibold text-neutral-900">{item.title}</div>
                  {item.lines.map((line) => (
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
    <div className="mt-auto flex items-center justify-between border-t border-neutral-300 pt-1 text-[8.5pt] text-neutral-500">
      <span>{BRAND.footerLine}</span>
      <span>
        Broj:{" "}
        <span className="font-mono text-[color:var(--primary)]">{number}</span>
      </span>
    </div>
  );
}

/** One A4 page. */
function A4Page({
  children,
  number,
  style,
}: {
  children: ReactNode;
  number: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="contract-paper mx-auto flex flex-col bg-white shadow-sm ring-1 ring-border"
      style={{
        width: "210mm",
        height: `${PAGE_HEIGHT_MM}mm`,
        padding: `${PAGE_MARGIN_MM}mm`,
        ...style,
      }}
    >
      <Letterhead />
      <div className="flex-1 overflow-hidden">{children}</div>
      <Footer number={number} />
    </div>
  );
}

export const ContractPreview = forwardRef<ContractPreviewHandle, Props>(
  ({ number, templateTitle, templateBody, vars }, ref) => {
    const filled = useMemo(
      () => fillTemplate(templateBody, vars),
      [templateBody, vars],
    );
    const blocks = useMemo(() => parseBlocks(filled), [filled]);

    const measureRef = useRef<HTMLDivElement>(null);
    const printRef = useRef<HTMLDivElement>(null);
    const scaleWrapRef = useRef<HTMLDivElement>(null);
    const [pages, setPages] = useState<Block[][]>([blocks]);
    const [currentPage, setCurrentPage] = useState(0);
    const [scale, setScale] = useState(1);

    useImperativeHandle(ref, () => ({
      getPrintElement: () => printRef.current,
    }));

    // Track container width and scale the A4 page so it always fits.
    useEffect(() => {
      const el = scaleWrapRef.current;
      if (!el) return;
      const A4_PX = 210 / MM_PER_PX; // ~794
      const update = () => {
        const w = el.clientWidth;
        const s = Math.min(1, w / A4_PX);
        setScale(s);
      };
      update();
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    // Measure each block's rendered height, then pack into pages.
    useLayoutEffect(() => {
      const el = measureRef.current;
      if (!el) return;
      const children = Array.from(el.children) as HTMLElement[];
      const heightsPx = children.map((c) => c.getBoundingClientRect().height);
      const heightsMm = heightsPx.map((h) => h * MM_PER_PX);

      const maxMm = CONTENT_HEIGHT_MM
        - 10; /* space for centered title on first page */
      const result: Block[][] = [];
      let current: Block[] = [];
      let used = 10; // reserve for title on page 1
      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        const h = heightsMm[i] ?? 5;
        // Signature block shouldn't be split; if it doesn't fit, new page.
        if (used + h > maxMm && current.length > 0) {
          result.push(current);
          current = [];
          used = 0;
        }
        current.push(b);
        used += h;
      }
      if (current.length) result.push(current);
      setPages(result.length ? result : [blocks]);
      setCurrentPage((p) => Math.min(p, Math.max(0, result.length - 1)));
    }, [blocks]);

    const totalPages = pages.length;
    const goPrev = () => setCurrentPage((p) => Math.max(0, p - 1));
    const goNext = () =>
      setCurrentPage((p) => Math.min(totalPages - 1, p + 1));

    useEffect(() => {
      if (currentPage >= totalPages) setCurrentPage(totalPages - 1);
    }, [totalPages, currentPage]);

    const renderPage = (pageBlocks: Block[], pageIdx: number) => (
      <A4Page number={number} key={pageIdx}>
        {pageBlocks.map((b, i) => (
          <BlockView key={i} block={b} vars={vars} />
        ))}
      </A4Page>
    );

    return (
      <div>
        {/* Pagination controls */}
        <div className="mb-3 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={goPrev}
            disabled={currentPage === 0}
            aria-label="Prethodna stranica"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium tabular-nums">
            {currentPage + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={goNext}
            disabled={currentPage >= totalPages - 1}
            aria-label="Sljedeća stranica"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Visible page (scaled to fit container width) */}
        <div ref={scaleWrapRef} className="w-full overflow-hidden">
          <div
            style={{
              width: "210mm",
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              height: `${297 * scale}mm`,
            }}
          >
            {pages[currentPage] && renderPage(pages[currentPage], currentPage)}
          </div>
        </div>

        {/* Hidden measurer — identical styling, width-matched, off-screen */}
        <div
          aria-hidden
          ref={measureRef}
          className="contract-paper"
          style={{
            position: "absolute",
            left: -99999,
            top: 0,
            width: `${210 - 2 * PAGE_MARGIN_MM}mm`,
            visibility: "hidden",
            pointerEvents: "none",
          }}
        >
          {blocks.map((b, i) => (
            <BlockView key={i} block={b} vars={vars} />
          ))}
        </div>

        {/* Hidden print container — all pages stacked, used by PDF export */}
        <div
          aria-hidden
          ref={printRef}
          style={{
            position: "absolute",
            left: -99999,
            top: 0,
            pointerEvents: "none",
          }}
        >
          {pages.map((p, i) => renderPage(p, i))}
        </div>
      </div>
    );
  },
);
ContractPreview.displayName = "ContractPreview";
