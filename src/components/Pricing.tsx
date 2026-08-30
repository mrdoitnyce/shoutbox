import { Reveal } from "../lib/hooks";

const INCLUDED = [
  "12 months of updates & support",
  "Unlimited dev / staging copies",
  "Full _data imports + schema migrations",
  "Discord support channel access",
  "No license callbacks — ever",
];

function Barcode() {
  const widths = [3, 1, 2, 1, 4, 1, 1, 3, 2, 1, 1, 4, 2, 1, 3, 1, 2, 2, 1, 3, 1, 4, 1, 2, 1, 3, 2, 1];
  let x = 0;
  return (
    <svg width="150" height="34" viewBox="0 0 150 34" aria-hidden="true" className="opacity-80">
      {widths.map((w, i) => {
        const rect = <rect key={i} x={x} y="0" width={w} height="34" fill={i % 2 === 0 ? "#EAF2FF" : "transparent"} />;
        x += w + 1.2;
        return rect;
      })}
    </svg>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-20 scroll-mt-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="text-center mb-12">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-signal">license</p>
            <h2 className="mt-2 font-display font-bold text-[34px] sm:text-[44px] tracking-tight">
              One payment. <span className="text-dim">Yours forever.</span>
            </h2>
            <p className="mt-3 text-[14.5px] text-dim max-w-[52ch] mx-auto">
              Licensed per live board. Staging, localhost and dev clones are always free.
            </p>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-[1fr_430px_1fr] gap-5 items-stretch">
          {/* Unlimited */}
          <Reveal delay={80}>
            <div className="card-hover h-full rounded-xl border border-line bg-panel/60 p-7 flex flex-col">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-dim">unlimited</p>
              <h3 className="mt-2 font-display font-semibold text-[22px]">Every board you run</h3>
              <p className="mt-4 font-display font-bold text-[44px] leading-none">
                $79<span className="text-[16px] text-faint font-body font-medium"> one-time</span>
              </p>
              <ul className="mt-6 space-y-2.5 text-[13.5px] text-dim flex-1">
                {["All single-license features", "Every board you own or operate", "Priority support queue"].map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-pulse shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="https://superchunes.com"
                target="_blank"
                rel="noreferrer"
                className="mt-7 h-11 rounded-lg border border-line2 flex items-center justify-center font-semibold text-[13.5px] text-ink hover:bg-panel2 hover:border-faint transition-all"
              >
                Get unlimited →
              </a>
            </div>
          </Reveal>

          {/* Main ticket — $30 */}
          <Reveal delay={0}>
            <div className="relative h-full">
              <div className="absolute -inset-3 rounded-2xl bg-signal/10 blur-2xl pointer-events-none" />
              <div className="ticket-notch relative h-full rounded-xl border-2 border-signal/60 bg-gradient-to-b from-panel2 to-panel p-7 flex flex-col shadow-[0_30px_80px_-24px_rgba(255,120,71,0.35)]">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-signal">single board · most common</p>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full border border-gold/40 text-gold">BEST VALUE</span>
                </div>
                <h3 className="mt-2 font-display font-semibold text-[24px]">[SC] Chatbox PRO</h3>
                <p className="mt-4 flex items-end gap-2">
                  <span className="font-display font-bold text-[64px] leading-none text-ink">$30</span>
                  <span className="text-[13.5px] text-faint mb-2">one-time · per live board</span>
                </p>
                <ul className="mt-6 space-y-2.5 text-[13.5px] text-dim flex-1">
                  {INCLUDED.map((f) => (
                    <li key={f} className="flex gap-2.5">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#35D8B7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="mt-[3px] shrink-0">
                        <path d="M2.5 8.5l3.5 3.5 7-8" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="https://superchunes.com"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 h-12 rounded-lg bg-signal text-abyss font-bold text-[14.5px] flex items-center justify-center gap-2 hover:bg-signal2 active:scale-[0.98] transition-all"
                >
                  Buy at superchunes.com
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14m0 0-5-5m5 5-5 5" />
                  </svg>
                </a>
                <div className="mt-5 pt-4 border-t border-dashed border-line2 flex items-center justify-between">
                  <Barcode />
                  <span className="font-mono text-[10px] text-faint text-right leading-relaxed">
                    LIC·SC·CBPRO<br />XF 2.3.x
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Developer */}
          <Reveal delay={160}>
            <div className="card-hover h-full rounded-xl border border-line bg-panel/60 p-7 flex flex-col">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-dim">developer</p>
              <h3 className="mt-2 font-display font-semibold text-[22px]">White-glove onboarding</h3>
              <p className="mt-4 font-display font-bold text-[44px] leading-none">
                $149<span className="text-[16px] text-faint font-body font-medium"> one-time</span>
              </p>
              <ul className="mt-6 space-y-2.5 text-[13.5px] text-dim flex-1">
                {["Everything in unlimited", "1-on-1 install session with Superchunes", "Custom command or theme tweak included"].map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="https://superchunes.com"
                target="_blank"
                rel="noreferrer"
                className="mt-7 h-11 rounded-lg border border-line2 flex items-center justify-center font-semibold text-[13.5px] text-ink hover:bg-panel2 hover:border-faint transition-all"
              >
                Book developer tier →
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <p className="mt-8 text-center font-mono text-[11.5px] text-faint">
            14-day refund if it won't install on a stock XF 2.3 board · checkout handled at{" "}
            <a href="https://superchunes.com" target="_blank" rel="noreferrer" className="text-pulse2 hover:underline">
              superchunes.com
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
