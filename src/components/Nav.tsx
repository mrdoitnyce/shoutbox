import { useEffect, useState } from "react";
import { useDownload } from "../lib/useDownload";

const LINKS = [
  { href: "#demo", label: "Live demo" },
  { href: "#features", label: "Features" },
  { href: "#package", label: "Package" },
  { href: "#install", label: "Install" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <rect x="4" y="8" width="56" height="40" rx="10" fill="#111C30" stroke="#FF7847" strokeWidth="4" />
      <path d="M18 56 L18 44 L32 46 Z" fill="#FF7847" />
      <rect x="15" y="20" width="24" height="5" rx="2.5" fill="#35D8B7" />
      <rect x="15" y="30" width="15" height="5" rx="2.5" fill="#8CA2C6" />
      <circle cx="47" cy="25" r="6" fill="#FFC24B" />
    </svg>
  );
}

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const { download, state, label } = useDownload();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        solid ? "nav-solid" : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-[64px] flex items-center gap-4">
        <a href="#top" className="flex items-center gap-2.5 group shrink-0">
          <span className="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
            <LogoMark />
          </span>
          <span className="font-display font-semibold text-[17px] tracking-tight leading-none">
            [SC] Chatbox <span className="text-signal">PRO</span>
          </span>
          <span className="hidden sm:inline-block font-mono text-[10px] text-pulse border border-pulse/30 bg-pulse/[0.07] rounded px-1.5 py-0.5 tracking-wider">
            v1.0.0
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-1 ml-6">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded-md text-[13.5px] text-dim hover:text-ink hover:bg-panel2 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <a
            href="https://superchunes.com"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 font-mono text-[12px] text-dim hover:text-pulse2 transition-colors"
          >
            superchunes.com
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          </a>
          <button
            onClick={download}
            className={`flex items-center gap-2 h-9 px-4 rounded-lg font-semibold text-[13px] transition-all active:scale-[0.97] ${
              state === "done"
                ? "bg-pulse/15 border border-pulse/40 text-pulse2"
                : "bg-signal text-abyss hover:bg-signal2"
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
              <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
            </svg>
            {label}
          </button>
        </div>
      </div>
    </header>
  );
}
