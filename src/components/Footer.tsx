import { LogoMark } from "./Nav";
import { useDownload } from "../lib/useDownload";

export default function Footer() {
  const { download, state, label } = useDownload();

  return (
    <footer className="relative border-t border-line mt-10 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(700px 320px at 20% 120%, rgba(255,120,71,0.08), transparent 65%), radial-gradient(700px 320px at 85% 120%, rgba(53,216,183,0.07), transparent 65%)",
        }}
      />
      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 py-14">
        <div className="flex flex-col lg:flex-row gap-10 items-start justify-between">
          <div className="max-w-[440px]">
            <a href="#top" className="flex items-center gap-2.5">
              <LogoMark size={34} />
              <span className="font-display font-semibold text-[20px] tracking-tight">
                [SC] Chatbox <span className="text-signal">PRO</span>
              </span>
            </a>
            <p className="mt-4 text-[13.5px] text-dim leading-relaxed">
              A real-time chatbox add-on for XenForo 2.3.x — designed, coded and shipped by{" "}
              <a
                href="https://superchunes.com"
                target="_blank"
                rel="noreferrer"
                className="text-gold hover:underline underline-offset-4 decoration-gold/40"
              >
                Superchunes
              </a>
              . Rooms, commands, moderation and a Discord bridge, the XF-native way.
            </p>
            <button
              onClick={download}
              className={`mt-6 inline-flex items-center gap-2 h-10 px-5 rounded-lg font-semibold text-[13px] transition-all active:scale-[0.97] ${
                state === "done"
                  ? "bg-pulse/15 border border-pulse/40 text-pulse2"
                  : "bg-signal text-abyss hover:bg-signal2"
              }`}
            >
              {label}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 text-[13px]">
            <div>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-faint mb-3">Product</p>
              <ul className="space-y-2 text-dim">
                {[
                  ["#demo", "Live demo"],
                  ["#features", "Features"],
                  ["#package", "Package"],
                  ["#changelog", "Changelog"],
                ].map(([href, t]) => (
                  <li key={href}>
                    <a href={href} className="hover:text-ink transition-colors">{t}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-faint mb-3">Buying</p>
              <ul className="space-y-2 text-dim">
                {[
                  ["#pricing", "Pricing — $30"],
                  ["#install", "Install guide"],
                  ["#faq", "FAQ"],
                ].map(([href, t]) => (
                  <li key={href}>
                    <a href={href} className="hover:text-ink transition-colors">{t}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-faint mb-3">Developer</p>
              <ul className="space-y-2 text-dim">
                <li>
                  <a href="https://superchunes.com" target="_blank" rel="noreferrer" className="hover:text-pulse2 transition-colors inline-flex items-center gap-1">
                    superchunes.com
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  </a>
                </li>
                <li>
                  <a href="https://superchunes.com/support" target="_blank" rel="noreferrer" className="hover:text-pulse2 transition-colors">
                    Support
                  </a>
                </li>
                <li>
                  <a href="https://superchunes.com/docs/sc-chatbox-pro" target="_blank" rel="noreferrer" className="hover:text-pulse2 transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-line flex flex-col sm:flex-row items-center gap-3 justify-between">
          <p className="font-mono text-[11px] text-faint">
            © 2026 Superchunes · [SC] Chatbox PRO 1.0.0 · for XenForo 2.3.0 – 2.3.12
          </p>
          <p className="font-mono text-[11px] text-faint">
            XenForo is a trademark of XenForo Ltd. This page packages the add-on zip entirely in your browser.
          </p>
        </div>
      </div>
    </footer>
  );
}
