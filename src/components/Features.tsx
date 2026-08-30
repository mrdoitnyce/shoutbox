import { useState } from "react";
import { Reveal } from "../lib/hooks";

/* Custom inline glyphs — drawn for this product, no icon library */
const GlyphRooms = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <path d="M4 9a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-5l-4 3v-3H6a2 2 0 0 1-2-2V9z" stroke="#FF7847" strokeWidth="1.8" />
    <path d="M19 8h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-1M19 5h3a2 2 0 0 1 2 2v6" stroke="#35D8B7" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const GlyphSlash = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <path d="M15.5 4 9 22" stroke="#35D8B7" strokeWidth="2" strokeLinecap="round" />
    <path d="M4 13h4M18 13h4" stroke="#8CA2C6" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const GlyphFlood = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <path d="M3 10c3-4 6 4 9 0s6 4 9 0M3 17c3-4 6 4 9 0s6 4 9 0" stroke="#35D8B7" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="21" cy="6" r="2.4" fill="#FF7847" />
  </svg>
);
const GlyphMod = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <path d="M13 3l8 3v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V6l8-3z" stroke="#FFC24B" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M9.5 13l2.5 2.5 4.5-5" stroke="#35D8B7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const GlyphPerms = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <rect x="4" y="4" width="18" height="18" rx="3" stroke="#8CA2C6" strokeWidth="1.8" />
    <path d="M8.5 13.5l3 3 6-6.5" stroke="#FF7847" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const GlyphGuest = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <circle cx="13" cy="9" r="4" stroke="#35D8B7" strokeWidth="1.8" />
    <path d="M5 22c1.5-4.5 4.5-6.5 8-6.5s6.5 2 8 6.5" stroke="#35D8B7" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M19 4l3 3m0-3-3 3" stroke="#FF7847" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const GlyphBridge = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <path d="M9 13.5 6.8 15.7a3.5 3.5 0 0 1-5-5L5 7.5" stroke="#8CA2C6" strokeWidth="1.8" strokeLinecap="round" transform="translate(3 1)" />
    <path d="M17 12.5l2.2-2.2a3.5 3.5 0 0 1 5 5L21 18.5" stroke="#FFC24B" strokeWidth="1.8" strokeLinecap="round" transform="translate(-3 -1)" />
    <path d="M10 16l6-6" stroke="#35D8B7" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const GlyphWidget = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <rect x="3" y="4" width="20" height="18" rx="2.5" stroke="#8CA2C6" strokeWidth="1.8" />
    <path d="M3 9h20" stroke="#8CA2C6" strokeWidth="1.8" />
    <rect x="14" y="12" width="6" height="7" rx="1" fill="#FF7847" opacity="0.85" />
    <path d="M6 13h5M6 16h5M6 19h3" stroke="#35D8B7" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);
const GlyphLean = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <path d="M4 21V11M10 21V5M16 21v-8M22 21V8" stroke="#35D8B7" strokeWidth="2" strokeLinecap="round" />
    <path d="M19 4h4v4" stroke="#FF7847" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ------------------------------------------------------------------ */

const COMMANDS: Record<string, { label: string; out: string; cls: string }> = {
  me: { label: "/me", out: "kai slams the desk in agreement", cls: "italic text-pulse2" },
  announce: { label: "/announce", out: "⚑ Patch 1.0.1 lands Friday", cls: "text-gold font-semibold" },
  shrug: { label: "/shrug", out: "it works on my machine ¯\\_(ツ)_/¯", cls: "text-ink/85" },
  flip: { label: "/flip", out: "(╯°□°)╯︵ ┻━┻", cls: "text-ink/85" },
};

const PERMS = ["view", "use", "bypassFlood", "moderate", "manageRooms"];

const MOD_LOG = [
  { t: "14:02", actor: "Deckard", act: "pinned", target: "“Patch notes thread”", color: "#FFC24B" },
  { t: "14:07", actor: "Mara", act: "soft-deleted", target: "message #4821", color: "#FF7847" },
  { t: "14:11", actor: "Mara", act: "banned sp4mbot for 24h", target: "reason: links", color: "#FF7847" },
  { t: "14:19", actor: "Deckard", act: "unpinned", target: "“Patch notes thread”", color: "#FFC24B" },
];

function CardShell({
  className = "",
  glyph,
  title,
  kicker,
  children,
  delay = 0,
}: {
  className?: string;
  glyph: React.ReactNode;
  title: string;
  kicker: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} className={className}>
      <div className="card-hover relative h-full rounded-xl border border-line bg-panel/60 p-6 overflow-hidden">
        <span className="absolute top-5 right-5 opacity-80">{glyph}</span>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-pulse2">{kicker}</p>
        <h3 className="mt-1.5 font-display font-semibold text-[19px] tracking-tight pr-10">{title}</h3>
        <div className="mt-3">{children}</div>
      </div>
    </Reveal>
  );
}

export default function Features() {
  const [flood, setFlood] = useState(5);
  const [cmd, setCmd] = useState("me");
  const [perms, setPerms] = useState<Record<string, boolean>>({
    view: true,
    use: true,
    bypassFlood: false,
    moderate: false,
    manageRooms: false,
  });
  const [guest, setGuest] = useState(true);
  const [room, setRoom] = useState("#lobby");

  return (
    <section id="features" className="relative py-20 scroll-mt-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-signal">feature manifest</p>
              <h2 className="mt-2 font-display font-bold text-[34px] sm:text-[44px] leading-[1.02] tracking-tight max-w-[16ch]">
                Everything a live shoutbox <span className="text-dim">should ship with.</span>
              </h2>
            </div>
            <p className="max-w-[36ch] text-[14px] text-dim leading-relaxed">
              No external servers, no iframe toys — entities, finders, services and permissions the
              XenForo way.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
          {/* Rooms — wide, interactive */}
          <CardShell className="lg:col-span-7" glyph={<GlyphRooms />} kicker="routing" title="Rooms & channels" delay={0}>
            <p className="text-[13.5px] text-dim leading-relaxed max-w-[56ch]">
              Ship separate spaces per community — <em>Lobby</em>, <em>Support</em>, a staff-only
              channel, guest-open or members-only. Each room keeps its own pin, history and
              prune window.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["#lobby", "#support", "#staff-only"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoom(r)}
                  className={`px-3 py-1.5 rounded-md font-mono text-[12px] border transition-all active:scale-95 ${
                    room === r
                      ? "bg-signal/15 border-signal/50 text-signal2"
                      : "border-line text-dim hover:border-line2 hover:text-ink"
                  }`}
                >
                  {r}
                  {r === "#staff-only" && <span className="ml-1.5 text-[9px] text-gold">staff</span>}
                </button>
              ))}
            </div>
            <pre className="mt-4 font-mono text-[11px] text-faint bg-abyss/70 border border-line rounded-lg p-3 overflow-x-auto">
{`{{ link('chatbox', null, {'room_id': $room.room_id}) }}  →  yourforum.com/chatbox/?room_id=2`}
            </pre>
          </CardShell>

          {/* Slash commands */}
          <CardShell className="lg:col-span-5" glyph={<GlyphSlash />} kicker="expression" title="Slash commands" delay={80}>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(COMMANDS).map((c) => (
                <button
                  key={c}
                  onClick={() => setCmd(c)}
                  className={`px-2.5 py-1 rounded font-mono text-[11.5px] transition-all active:scale-95 ${
                    cmd === c ? "bg-pulse/15 text-pulse2 border border-pulse/40" : "text-dim border border-line hover:text-ink"
                  }`}
                >
                  {COMMANDS[c].label}
                </button>
              ))}
            </div>
            <div className="mt-3 rounded-lg border border-line bg-abyss/70 px-3.5 py-3 min-h-[52px] flex items-center">
              <p className={`text-[13px] ${COMMANDS[cmd].cls}`}>
                <span className="text-faint font-mono text-[11px] mr-2">kai:</span>
                {COMMANDS[cmd].out}
              </p>
            </div>
            <p className="mt-3 text-[12.5px] text-faint">
              Parsed server-side in <span className="font-mono text-dim">Sender::parseCommand()</span> — add your own in one array.
            </p>
          </CardShell>

          {/* Flood control */}
          <CardShell className="lg:col-span-5" glyph={<GlyphFlood />} kicker="anti-spam" title="Flood control" delay={0}>
            <p className="text-[13.5px] text-dim leading-relaxed">
              One option gates the firehose. Staff groups can bypass it with a permission.
            </p>
            <div className="mt-4">
              <input
                type="range"
                min={0}
                max={30}
                value={flood}
                onChange={(e) => setFlood(Number(e.target.value))}
                className="sc-range w-full"
                style={{ "--fill": `${(flood / 30) * 100}%` } as React.CSSProperties}
                aria-label="Flood limit seconds"
              />
              <div className="mt-2 flex items-center justify-between font-mono text-[11px]">
                <span className="text-faint">scChatboxFloodSeconds</span>
                <span className={`font-semibold ${flood === 0 ? "text-signal2" : "text-pulse2"}`}>
                  {flood === 0 ? "OFF — brave" : `${flood}s between posts`}
                </span>
              </div>
            </div>
          </CardShell>

          {/* Moderation */}
          <CardShell className="lg:col-span-7" glyph={<GlyphMod />} kicker="moderation" title="Pin, delete, ban — in two clicks" delay={80}>
            <p className="text-[13.5px] text-dim leading-relaxed max-w-[56ch]">
              One pin per room, soft deletes that moderators can still read, and timed bans with a
              reason trail. Everything behind the <span className="font-mono text-dim">moderate</span> permission.
            </p>
            <div className="mt-4 space-y-1.5">
              {MOD_LOG.map((l, i) => (
                <Reveal key={i} delay={i * 110}>
                  <p className="font-mono text-[11.5px] flex items-center gap-2.5 bg-abyss/70 border border-line rounded-md px-3 py-1.5">
                    <span className="text-faint">{l.t}</span>
                    <span style={{ color: l.color }}>{l.actor}</span>
                    <span className="text-dim">{l.act}</span>
                    <span className="text-ink/80 truncate">{l.target}</span>
                  </p>
                </Reveal>
              ))}
            </div>
          </CardShell>

          {/* Permissions */}
          <CardShell className="lg:col-span-4" glyph={<GlyphPerms />} kicker="acl" title="Granular permissions" delay={0}>
            <ul className="space-y-1.5">
              {PERMS.map((p) => (
                <li key={p}>
                  <button
                    onClick={() => setPerms((prev) => ({ ...prev, [p]: !prev[p] }))}
                    className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md border border-line hover:border-line2 transition-all group"
                  >
                    <span
                      className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${
                        perms[p] ? "bg-pulse border-pulse" : "border-line2 group-hover:border-faint"
                      }`}
                    >
                      {perms[p] && (
                        <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="#0B111C" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 6.5l2.5 2.5L10 3" />
                        </svg>
                      )}
                    </span>
                    <span className={`font-mono text-[12px] ${perms[p] ? "text-ink" : "text-faint"}`}>{p}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[12px] text-faint">Set per group, per node — the XF permission system, untouched.</p>
          </CardShell>

          {/* Guest mode */}
          <CardShell className="lg:col-span-4" glyph={<GlyphGuest />} kicker="access" title="Guest mode" delay={80}>
            <p className="text-[13.5px] text-dim leading-relaxed">
              Let visitors <span className="text-ink">lurk the lobby</span> without an account — read-only,
              composer replaced by a login prompt.
            </p>
            <button
              onClick={() => setGuest(!guest)}
              className="mt-4 w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-line hover:border-line2 transition-all"
              aria-pressed={guest}
            >
              <span className="font-mono text-[12px] text-dim">scChatboxGuestView</span>
              <span className={`relative w-11 h-6 rounded-full transition-colors ${guest ? "bg-pulse" : "bg-line2"}`}>
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-ink transition-all ${guest ? "left-[22px]" : "left-0.5"}`}
                />
              </span>
            </button>
            <p className={`mt-3 font-mono text-[11px] ${guest ? "text-pulse2" : "text-signal2"}`}>
              {guest ? "guests: reading #lobby" : "guests: seeing a login wall"}
            </p>
          </CardShell>

          {/* Discord bridge */}
          <CardShell className="lg:col-span-4" glyph={<GlyphBridge />} kicker="integrations" title="Discord bridge" delay={160}>
            <p className="text-[13.5px] text-dim leading-relaxed">
              Point one option at a webhook URL and chatbox highlights land in your Discord channel.
            </p>
            <pre className="mt-3 font-mono text-[10.5px] leading-relaxed text-faint bg-abyss/70 border border-line rounded-lg p-3 overflow-x-auto">
{`POST /webhooks/1283…/••••
{ "username": "Mara",
  "content": "patch 1.0.1 friday ⚑" }`}
            </pre>
          </CardShell>

          {/* Surfaces */}
          <CardShell className="lg:col-span-6" glyph={<GlyphWidget />} kicker="placement" title="Three surfaces, one codebase" delay={0}>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {[
                { t: "Full page", d: "/chatbox/", h: "h-[74px]" },
                { t: "Sidebar widget", d: "any position", h: "h-[52px]" },
                { t: "Floating launcher", d: "all pages", h: "h-[38px]" },
              ].map((s) => (
                <div key={s.t} className="group rounded-lg border border-line bg-abyss/70 p-3 hover:border-pulse/40 transition-colors cursor-default">
                  <div className={`${s.h} rounded-md border border-dashed border-line2 bg-panel2/60 flex items-end p-1.5 transition-colors group-hover:border-pulse/50`}>
                    <span className="w-3/5 h-1.5 rounded-full bg-pulse/60" />
                  </div>
                  <p className="mt-2 text-[12.5px] font-semibold">{s.t}</p>
                  <p className="font-mono text-[10.5px] text-faint">{s.d}</p>
                </div>
              ))}
            </div>
          </CardShell>

          {/* Lean storage */}
          <CardShell className="lg:col-span-6" glyph={<GlyphLean />} kicker="performance" title="Self-pruning storage" delay={80}>
            <p className="text-[13.5px] text-dim leading-relaxed max-w-[56ch]">
              Every send trims the room back to <span className="font-mono text-ink">scChatboxMaxStored</span> rows —
              the message table never bloats, pins are exempt, and the hot path is a covered index.
            </p>
            <pre className="mt-3 font-mono text-[10.5px] leading-relaxed text-faint bg-abyss/70 border border-line rounded-lg p-3 overflow-x-auto">
{`DELETE FROM xf_sc_chat_message
WHERE room_id = ? AND message_id <= ?
  AND is_pinned = 0   -- kept: 400 newest / room`}
            </pre>
          </CardShell>
        </div>
      </div>
    </section>
  );
}
