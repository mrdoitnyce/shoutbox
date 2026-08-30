import { useCountUp, useInView, useScramble } from "../lib/hooks";
import { useDownload } from "../lib/useDownload";
import { getPackageStats, formatBytes } from "../lib/downloadZip";
import ChatDemo from "./ChatDemo";

const pkg = getPackageStats();

function Stat({ target, suffix, label, inView }: { target: number; suffix: string; label: string; inView: boolean }) {
  const v = useCountUp(target, inView);
  return (
    <div className="flex flex-col">
      <span className="font-display font-semibold text-[26px] leading-none text-ink">
        {v}
        <span className="text-signal">{suffix}</span>
      </span>
      <span className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-faint">{label}</span>
    </div>
  );
}

export default function Hero() {
  const l1 = useScramble("YOUR FORUM,", 250);
  const l2 = useScramble("LIVE IN THE", 900);
  const l3 = useScramble("CHATBOX.", 1700);
  const { download, state, label } = useDownload();
  const { ref, inView } = useInView<HTMLDivElement>(0.4);

  return (
    <section id="top" className="relative pt-[104px] pb-10">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1fr_1.08fr] gap-10 lg:gap-12 items-center">
          {/* left — pitch */}
          <div>
            <p className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] uppercase text-pulse2 border border-pulse/25 bg-pulse/[0.06] rounded-full px-3.5 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-pulse live-dot" />
              XenForo 2.3.0 → 2.3.12 add-on
            </p>

            <h1 className="mt-5 font-display font-bold tracking-[-0.02em] leading-[0.98] text-[44px] sm:text-[58px] xl:text-[68px]">
              <span className="block">{l1.output}</span>
              <span className="block text-dim">{l2.output}</span>
              <span className="block">
                <span className="text-signal">{l3.output}</span>
                <span className={`text-signal caret-blink ${l3.done ? "" : "opacity-0"}`}>_</span>
              </span>
            </h1>

            <p className="mt-6 max-w-[52ch] text-[15.5px] leading-relaxed text-dim">
              <strong className="text-ink font-semibold">[SC] Chatbox PRO</strong> bolts a real-time,
              room-based chat onto your XenForo board — slash commands, per-room pins, flood control,
              timed bans, guest mode and a Discord bridge. No frameworks, no external services:
              <span className="text-pulse2"> 100% XF-native PHP</span>, packaged by{" "}
              <a
                href="https://superchunes.com"
                target="_blank"
                rel="noreferrer"
                className="text-gold underline decoration-gold/40 underline-offset-4 hover:decoration-gold transition-colors"
              >
                Superchunes
              </a>
              .
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                onClick={download}
                title="Click to build & save SC_ChatboxPRO_1.0.0.zip"
                className={`group flex items-center gap-2.5 h-12 px-6 rounded-lg font-semibold text-[14.5px] transition-all active:scale-[0.97] ${
                  state === "done"
                    ? "bg-pulse/15 border border-pulse/40 text-pulse2"
                    : "cta-beacon bg-signal text-abyss hover:bg-signal2 shadow-[0_14px_36px_-12px_rgba(255,120,71,0.55)]"
                }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform group-hover:translate-y-0.5">
                  <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
                  <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                </svg>
                {label}
              </button>
              <a
                href="#package"
                className="flex items-center gap-2 h-12 px-5 rounded-lg border border-line2 text-[14px] font-medium text-ink hover:bg-panel2 hover:border-faint transition-all"
              >
                Peek inside the package
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 5v14m0 0 6-6m-6 6-6-6" />
                </svg>
              </a>
            </div>

            {/* start-here hint for first-timers */}
            <div className="mt-3.5 flex items-center gap-2 font-mono text-[11.5px] text-gold">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="nudge-left" aria-hidden="true">
                <path d="M19 12H5m0 0 6 6m-6-6 6-6" />
              </svg>
              start here — one click builds the zip right in your browser, no signup
            </div>

            <div ref={ref} className="mt-10 flex items-center gap-8 sm:gap-12 border-t border-line pt-6">
              <Stat target={pkg.files} suffix="" label="files in the zip" inView={inView} />
              <Stat target={5} suffix="" label="granular permissions" inView={inView} />
              <Stat target={9} suffix="" label="admin options" inView={inView} />
              <div className="flex flex-col">
                <span className="font-display font-semibold text-[26px] leading-none text-ink">
                  {formatBytes(pkg.bytes)}
                </span>
                <span className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-faint">
                  source payload
                </span>
              </div>
            </div>
          </div>

          {/* right — the chatbox itself */}
          <div id="demo" className="relative scroll-mt-24">
            {/* corner brackets */}
            <span className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-signal/70 pointer-events-none hidden sm:block" />
            <span className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-pulse/70 pointer-events-none hidden sm:block" />
            <div
              className="absolute -inset-8 rounded-[28px] pointer-events-none"
              style={{
                background:
                  "radial-gradient(60% 60% at 70% 20%, rgba(255,120,71,0.1), transparent 65%), radial-gradient(50% 50% at 20% 90%, rgba(53,216,183,0.09), transparent 65%)",
              }}
            />
            <ChatDemo />
            <p className="mt-3 text-center font-mono text-[11px] text-faint">
              ↑ fully interactive — type a message, try <span className="text-pulse2">/shrug</span>, hover to react, pin something
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
