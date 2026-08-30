import { Reveal } from "../lib/hooks";
import { useDownload } from "../lib/useDownload";

const STEPS = [
  {
    n: "01",
    title: "Grab the archive",
    body: "One click packages the whole add-on in your browser — no account wall to see what you're installing.",
    code: "SC_ChatboxPRO_1.0.0.zip   (upload/ + README + CHANGELOG)",
  },
  {
    n: "02",
    title: "Install from archive",
    body: "Admin CP → Add-ons → Install / upgrade from archive. Upload the ZIP as-is and approve the schema changes: 3 new tables, 2 user columns.",
    code: "xf_sc_chat_message · xf_sc_chat_room · xf_sc_chat_ban",
  },
  {
    n: "03",
    title: "Tune options & permissions",
    body: "Options → [SC] Chatbox PRO for poll interval, flood limit, height and guest mode. Then Group permissions → [SC] Chatbox to open the doors.",
    code: "scChatboxMaster: ON · flood: 5s · view: members+guests",
  },
  {
    n: "04",
    title: "Place it anywhere",
    body: "The /chatbox/ route is live immediately. Add the “[SC] Chatbox” widget to any sidebar, and the floating launcher appears sitewide automatically.",
    code: "yourforum.com/chatbox/   →   200 OK",
  },
];

export default function InstallGuide() {
  const { download, state, label } = useDownload();

  return (
    <section id="install" className="relative py-20 scroll-mt-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 grid lg:grid-cols-[1fr_420px] gap-12 items-start">
        <div>
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-signal">four steps, five minutes</p>
            <h2 className="mt-2 font-display font-bold text-[34px] sm:text-[44px] leading-[1.02] tracking-tight max-w-[18ch]">
              From zip to <span className="text-dim">live chat.</span>
            </h2>
          </Reveal>

          <div className="mt-10 relative">
            <span className="absolute left-[27px] top-4 bottom-4 w-px bg-line hidden sm:block" />
            <div className="space-y-8">
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delay={i * 90}>
                  <div className="flex gap-5">
                    <span className="hidden sm:flex w-[54px] h-[54px] shrink-0 rounded-xl border border-line2 bg-panel font-display font-semibold text-[17px] items-center justify-center text-signal relative z-10">
                      {s.n}
                    </span>
                    <div className="flex-1 pt-1">
                      <h3 className="font-display font-semibold text-[19px]">
                        <span className="sm:hidden font-mono text-[12px] text-signal mr-2">{s.n}</span>
                        {s.title}
                      </h3>
                      <p className="mt-1.5 text-[13.5px] text-dim leading-relaxed max-w-[58ch]">{s.body}</p>
                      <pre className="mt-2.5 inline-block font-mono text-[11px] text-pulse2 bg-abyss/80 border border-line rounded-md px-3 py-1.5 overflow-x-auto max-w-full">
                        {s.code}
                      </pre>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* terminal */}
        <Reveal delay={150} className="lg:sticky lg:top-24">
          <div className="rounded-xl border border-line bg-deep overflow-hidden shadow-[0_30px_70px_-30px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-line bg-panel">
              <span className="w-2.5 h-2.5 rounded-full bg-signal/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-gold/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-pulse/80" />
              <span className="ml-2 font-mono text-[11px] text-faint">admin cp — add-ons</span>
            </div>
            <div className="p-5 font-mono text-[12px] leading-[1.9] text-dim">
              <p><span className="text-faint">$</span> install <span className="text-signal2">SC_ChatboxPRO_1.0.0.zip</span></p>
              <p className="text-faint">› validating addon.json … <span className="text-pulse2">ok</span></p>
              <p className="text-faint">› require XF ≥ 2.3.0 … <span className="text-pulse2">2.3.12 found</span></p>
              <p className="text-faint">› schema: +3 tables, ~2 columns … <span className="text-pulse2">ok</span></p>
              <p className="text-faint">› importing _data (9 files) … <span className="text-pulse2">ok</span></p>
              <p className="text-faint">› seeding rooms: Lobby, Support … <span className="text-pulse2">ok</span></p>
              <p className="mt-2 text-ink">
                Installed <span className="text-signal font-semibold">[SC] Chatbox PRO 1.0.0</span> in 4.2s
                <span className="caret-blink text-pulse">▊</span>
              </p>
            </div>
            <div className="px-5 pb-5">
              <button
                onClick={download}
                className={`w-full h-11 rounded-lg font-semibold text-[14px] transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                  state === "done"
                    ? "bg-pulse/15 border border-pulse/40 text-pulse2"
                    : "bg-signal text-abyss hover:bg-signal2"
                }`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
                  <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                </svg>
                {label}
              </button>
              <p className="mt-3 text-center font-mono text-[10.5px] text-faint">
                packaged client-side · nothing uploaded anywhere
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
