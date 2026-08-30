import { useState } from "react";
import { Reveal } from "../lib/hooks";

const FAQS = [
  {
    q: "Which XenForo versions are supported?",
    a: "XenForo 2.3.0 through 2.3.12 — the add-on declares require XF ≥ 2.3.0 in addon.json and every release is regression-tested on the latest 2.3.x patch. XenForo 2.2 is not supported.",
  },
  {
    q: "Is it real-time? Does it need WebSockets or an external server?",
    a: "Out of the box it uses a lean client poll (2.5s default, tunable in options) — no Node process, no third-party service, nothing to babysit on your host. The client is written so a true XF WebSocket push transport can slot in later without touching your templates.",
  },
  {
    q: "Will it slow my forum down?",
    a: "The hot path is a single indexed SELECT per poll per viewer, and every send prunes the room back to your configured row cap, so xf_sc_chat_message stays small forever. Guests can be set to read-only, which skips the flood/ban checks entirely.",
  },
  {
    q: "Can I use it on staging or local boards?",
    a: "Yes — the license covers one live production domain plus unlimited development, staging and localhost copies. There is no phone-home license check in the code; enforcement is by trust, like every good XenForo shop.",
  },
  {
    q: "How do updates work?",
    a: "Download the new archive from your account at superchunes.com and install it over the old one — Setup.php upgrade steps run automatically and your rooms, pins and history are untouched.",
  },
  {
    q: "What if it doesn't work on my board?",
    a: "You get human support from Superchunes via the support channel, and a 14-day refund if the add-on simply will not install on a stock XenForo 2.3 installation.",
  },
];

export default function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-20 scroll-mt-16">
      <div className="max-w-[860px] mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="text-center mb-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-signal">before you ask</p>
            <h2 className="mt-2 font-display font-bold text-[34px] sm:text-[44px] tracking-tight">
              Fair questions, <span className="text-dim">straight answers.</span>
            </h2>
          </div>
        </Reveal>

        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const open = openIdx === i;
            return (
              <Reveal key={i} delay={i * 60}>
                <div
                  className={`rounded-xl border transition-colors ${
                    open ? "border-signal/40 bg-panel" : "border-line bg-panel/50 hover:border-line2"
                  }`}
                >
                  <button
                    onClick={() => setOpenIdx(open ? null : i)}
                    className="w-full flex items-center gap-4 px-5 py-4 text-left"
                    aria-expanded={open}
                  >
                    <span className={`font-mono text-[11px] ${open ? "text-signal" : "text-faint"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 font-semibold text-[15px] leading-snug">{f.q}</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className={`shrink-0 transition-transform duration-300 ${open ? "rotate-45 text-signal" : "text-faint"}`}
                      aria-hidden="true"
                    >
                      <path d="M8 2v12M2 8h12" />
                    </svg>
                  </button>
                  <div
                    className="grid transition-all duration-300 ease-out"
                    style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 pl-[52px] text-[13.5px] text-dim leading-relaxed">{f.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
