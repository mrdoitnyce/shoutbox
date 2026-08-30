import { Reveal } from "../lib/hooks";

const RELEASED = [
  "Room-based chat with per-room guest & staff visibility",
  "Real-time client — 2.5s poll, configurable, XF push-notify aware",
  "Slash commands: /me, /announce, /shrug, /flip",
  "Moderation: pin (one per room), soft delete, timed bans with reasons",
  "Flood control with per-group bypass permission",
  "Self-pruning message storage per room",
  "Full page /chatbox/, sidebar widget, floating launcher",
  "Discord webhook bridge (option-driven)",
  "Tested end-to-end on XenForo 2.3.0 → 2.3.12",
];

const ROADMAP = [
  { v: "1.1.0", items: ["Emoji reactions backend + picker", "Per-room slow mode", "Chat message search in ACP"] },
  { v: "1.2.0", items: ["XF WebSocket push experiment (zero-poll mode)", "Per-user accent themes", "Export room transcripts"] },
];

export default function Changelog() {
  return (
    <section id="changelog" className="relative py-20 scroll-mt-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-signal">changelog & roadmap</p>
          <h2 className="mt-2 font-display font-bold text-[34px] sm:text-[44px] leading-[1.02] tracking-tight">
            Shipped today, <span className="text-dim">planned tomorrow.</span>
          </h2>
        </Reveal>

        <div className="mt-10 grid lg:grid-cols-[1.25fr_1fr] gap-5">
          {/* released */}
          <Reveal delay={80}>
            <div className="rounded-xl border border-line bg-panel/60 p-7 h-full">
              <div className="flex items-center gap-3">
                <span className="font-display font-bold text-[26px] text-ink">v1.0.1</span>
                <span className="font-mono text-[10px] px-2 py-1 rounded-full bg-pulse/10 border border-pulse/30 text-pulse2 uppercase tracking-wider">
                  current release
                </span>
              </div>
              <ul className="mt-5 space-y-2.5">
                {[
                  "Hotfix: corrected XF2 template syntax in sc_chatbox_main ({{ phrase() }}) — v1.0.0 could stall the final rebuild job and leave the add-on with \u201cactions pending\u201d",
                  "Hardened the app_pub_setup listener signature so it can never misfire",
                ].map((r, i) => (
                  <li key={i} className="flex gap-3 text-[13.5px] text-dim leading-relaxed">
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#35D8B7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="mt-[4px] shrink-0">
                      <path d="M8 2v12M2 8h12" />
                    </svg>
                    {r}
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-3 mt-7 pt-5 border-t border-line">
                <span className="font-display font-bold text-[20px] text-dim">v1.0.0</span>
                <span className="font-mono text-[10px] px-2 py-1 rounded-full bg-panel2 border border-line2 text-faint uppercase tracking-wider">
                  initial release
                </span>
              </div>
              <ul className="mt-4 space-y-2.5">
                {RELEASED.map((r, i) => (
                  <Reveal key={i} delay={i * 60}>
                    <li className="flex gap-3 text-[13.5px] text-dim leading-relaxed">
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#FF7847" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="mt-[4px] shrink-0">
                        <path d="M8 2v12M2 8h12" />
                      </svg>
                      {r}
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* roadmap */}
          <div className="space-y-5">
            {ROADMAP.map((rel, ri) => (
              <Reveal key={rel.v} delay={140 + ri * 90}>
                <div className="rounded-xl border border-dashed border-line2 bg-deep/60 p-6">
                  <div className="flex items-center gap-3">
                    <span className="font-display font-bold text-[20px] text-dim">{rel.v}</span>
                    <span className="font-mono text-[10px] px-2 py-1 rounded-full border border-line2 text-faint uppercase tracking-wider">
                      on the bench
                    </span>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {rel.items.map((it) => (
                      <li key={it} className="flex gap-3 text-[13px] text-faint">
                        <span className="mt-[8px] w-1.5 h-1.5 rounded-full bg-line2 shrink-0" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
            <Reveal delay={320}>
              <p className="font-mono text-[11px] text-faint leading-relaxed px-1">
                Buyers vote on roadmap order in the support channel — license includes every 1.x update free.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
