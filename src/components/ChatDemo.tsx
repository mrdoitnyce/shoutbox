import { useEffect, useMemo, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Types & seed data                                                   */
/* ------------------------------------------------------------------ */

type Role = "dev" | "admin" | "mod" | "member" | "you";

interface ChatUser {
  name: string;
  role: Role;
  status: "online" | "idle";
}

interface ChatMsg {
  id: number;
  room: string;
  name: string;
  role: Role;
  text: string;
  command: "" | "me" | "announce" | "system";
  time: string;
  reactions: Record<string, number>;
  mine?: boolean;
  pinned?: boolean;
}

const ROOMS = [
  { id: "lobby", label: "#lobby", desc: "general chatter" },
  { id: "support", label: "#support", desc: "quick help" },
  { id: "dev-chat", label: "#dev-chat", desc: "add-on talk" },
];

const ROLE_STYLE: Record<Role, { color: string; badge?: string; badgeBg?: string }> = {
  dev: { color: "#FFC24B", badge: "DEV", badgeBg: "rgba(255,194,75,0.14)" },
  admin: { color: "#FF7847", badge: "ADMIN", badgeBg: "rgba(255,120,71,0.14)" },
  mod: { color: "#35D8B7", badge: "MOD", badgeBg: "rgba(53,216,183,0.14)" },
  member: { color: "#EAF2FF" },
  you: { color: "#7CEAD4", badge: "YOU", badgeBg: "rgba(124,234,212,0.14)" },
};

const USERS: ChatUser[] = [
  { name: "Superchunes", role: "dev", status: "online" },
  { name: "Mara", role: "admin", status: "online" },
  { name: "Deckard", role: "mod", status: "online" },
  { name: "kai", role: "member", status: "online" },
  { name: "Juni", role: "member", status: "idle" },
  { name: "Theo", role: "member", status: "online" },
];

const now = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

let seq = 100;
const mk = (
  room: string,
  name: string,
  role: Role,
  text: string,
  command: ChatMsg["command"] = "",
  extra: Partial<ChatMsg> = {}
): ChatMsg => ({
  id: ++seq,
  room,
  name,
  role,
  text,
  command,
  time: now(),
  reactions: {},
  ...extra,
});

const SEED: ChatMsg[] = [
  mk("lobby", "Mara", "admin", "Morning crew — chatbox is live on the forum 🎉", "", {
    reactions: { "🔥": 3 },
    pinned: true,
  }),
  mk("lobby", "kai", "member", "finally, shoutbox vibes but modern"),
  mk("lobby", "Theo", "member", "rooms are clean. lobby or support?", "", {
    reactions: { "👍": 2 },
  }),
  mk("lobby", "Superchunes", "dev", "poll interval is 2.5s by default — tune it in options"),
  mk("support", "Juni", "member", "how do I add the widget to the forum sidebar?"),
  mk("support", "Deckard", "mod", "ACP → Appearance → Widgets → [SC] Chatbox → pick a position", "", {
    reactions: { "👍": 4 },
  }),
  mk("dev-chat", "Superchunes", "dev", "1.0.0 shipped — XF 2.3.12 tested end to end"),
  mk("dev-chat", "Mara", "admin", "schema install was clean, 3 tables + 2 user columns", "", {
    reactions: { "🔥": 2 },
  }),
];

/* Scripted live feed */
const SCRIPT: { room: string; name: string; role: Role; text: string; command?: ChatMsg["command"] }[] = [
  { room: "lobby", name: "kai", role: "member", text: "anyone else running this on 2.3.12?" },
  { room: "lobby", name: "Deckard", role: "mod", text: "yep — no deprecation warnings at all" },
  { room: "support", name: "Juni", role: "member", text: "guests can read but not post, exactly what I wanted" },
  { room: "lobby", name: "Superchunes", role: "dev", text: "slashes the desk", command: "me" },
  { room: "dev-chat", name: "Mara", role: "admin", text: "flood limit at 5s keeps the spam bots out" },
  { room: "lobby", name: "Theo", role: "member", text: "pinned message per room is such a small thing but so useful" },
  { room: "dev-chat", name: "Superchunes", role: "dev", text: "Discord bridge next: chatbox → webhook → #announcements" },
  { room: "support", name: "Deckard", role: "mod", text: "reminder: permissions live under their own [SC] Chatbox interface" },
  { room: "lobby", name: "kai", role: "member", text: "the /announce command goes HARD", command: "" },
  { room: "lobby", name: "Mara", role: "admin", text: "patch 1.0.1 Friday — pruning query got 40% faster", command: "announce" },
];

const BOT_REPLIES = [
  { name: "Deckard", role: "mod" as Role, text: "noted 👀" },
  { name: "kai", role: "member" as Role, text: "agreed" },
  { name: "Superchunes", role: "dev" as Role, text: "good shout — adding that to the roadmap" },
  { name: "Mara", role: "admin" as Role, text: "same here on my board" },
];

const REACTIONS = ["🔥", "😂", "👍", "❤️"];
const MAX_LEN = 240;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function ChatDemo() {
  const [activeRoom, setActiveRoom] = useState("lobby");
  const [messages, setMessages] = useState<ChatMsg[]>(SEED);
  const [unread, setUnread] = useState<Record<string, number>>({ lobby: 0, support: 0, "dev-chat": 0 });
  const [typing, setTyping] = useState<{ name: string; room: string } | null>(null);
  const [draft, setDraft] = useState("");
  const [myName, setMyName] = useState("you");
  const [flash, setFlash] = useState<string | null>(null);

  const feedRef = useRef<HTMLDivElement>(null);
  const scriptIdx = useRef(0);
  const mounted = useRef(true);

  /* Live feed: typing indicator → message */
  useEffect(() => {
    mounted.current = true;
    const iv = window.setInterval(() => {
      const entry = SCRIPT[scriptIdx.current % SCRIPT.length];
      scriptIdx.current += 1;

      setTyping({ name: entry.name, room: entry.room });
      window.setTimeout(() => {
        if (!mounted.current) return;
        setTyping(null);
        setMessages((prev) => [...prev.slice(-160), mk(entry.room, entry.name, entry.role, entry.text, entry.command ?? "")]);
        setUnread((u) => (entry.room !== activeRoomRef.current ? { ...u, [entry.room]: (u[entry.room] || 0) + 1 } : u));
      }, 1300);
    }, 4600);
    return () => {
      mounted.current = false;
      window.clearInterval(iv);
    };
  }, []);

  const activeRoomRef = useRef(activeRoom);
  useEffect(() => {
    activeRoomRef.current = activeRoom;
  }, [activeRoom]);

  /* Autoscroll */
  const roomMessages = useMemo(
    () => messages.filter((m) => m.room === activeRoom),
    [messages, activeRoom]
  );
  useEffect(() => {
    const el = feedRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [roomMessages.length, typing]);

  /* System flash toasts (command feedback) */
  useEffect(() => {
    if (!flash) return;
    const t = window.setTimeout(() => setFlash(null), 2200);
    return () => window.clearTimeout(t);
  }, [flash]);

  const pushMessage = (msg: Omit<ChatMsg, "id" | "time" | "reactions">) =>
    setMessages((prev) => [
      ...prev.slice(-160),
      { ...msg, id: ++seq, time: now(), reactions: {} },
    ]);

  /* ------------- command parsing ------------- */
  const handleSend = () => {
    const raw = draft.trim();
    if (!raw) return;

    if (raw.startsWith("/")) {
      const space = raw.indexOf(" ");
      const head = (space === -1 ? raw.slice(1) : raw.slice(1, space)).toLowerCase();
      const body = space === -1 ? "" : raw.slice(space + 1).trim();

      switch (head) {
        case "me":
          pushMessage({ room: activeRoom, name: myName, role: "you", text: body || "…", command: "me", mine: true });
          break;
        case "announce":
          pushMessage({ room: activeRoom, name: myName, role: "you", text: body || "announcement", command: "announce", mine: true });
          break;
        case "shrug":
          pushMessage({ room: activeRoom, name: myName, role: "you", text: `${body ? body + " " : ""}¯\\_(ツ)_/¯`, command: "", mine: true });
          break;
        case "flip":
          pushMessage({ room: activeRoom, name: myName, role: "you", text: "(╯°□°)╯︵ ┻━┻", command: "", mine: true });
          break;
        case "clear":
          setMessages((prev) => prev.filter((m) => m.room !== activeRoom));
          setFlash(`${ROOMS.find((r) => r.id === activeRoom)?.label} cleared`);
          break;
        case "nick":
          if (body) {
            setMyName(body.slice(0, 20));
            setFlash(`Nickname → ${body.slice(0, 20)}`);
          }
          break;
        case "help":
          pushMessage({
            room: activeRoom,
            name: "system",
            role: "member",
            text: "commands: /me · /announce · /shrug · /flip · /nick <name> · /clear · /help",
            command: "system",
          });
          break;
        default:
          setFlash(`Unknown command /${head} — try /help`);
      }
    } else {
      pushMessage({ room: activeRoom, name: myName, role: "you", text: raw, command: "", mine: true });
      /* occasional bot reply */
      if (Math.random() < 0.55) {
        const reply = BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)];
        window.setTimeout(() => {
          if (!mounted.current) return;
          setTyping({ name: reply.name, room: activeRoomRef.current });
        }, 900);
        window.setTimeout(() => {
          if (!mounted.current) return;
          setTyping(null);
          pushMessage({ room: activeRoomRef.current, name: reply.name, role: reply.role, text: reply.text, command: "" });
        }, 2400);
      }
    }
    setDraft("");
  };

  const toggleReaction = (msgId: number, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== msgId) return m;
        const mineKey = `__mine_${emoji}`;
        const has = Boolean((m.reactions as Record<string, number>)[mineKey]);
        const next = { ...m.reactions, [emoji]: (m.reactions[emoji] || 0) + (has ? -1 : 1) };
        if (next[emoji] <= 0) delete next[emoji];
        (next as Record<string, number>)[mineKey] = has ? 0 : 1;
        return { ...m, reactions: next };
      })
    );
  };

  const togglePin = (msgId: number) => {
    setMessages((prev) => {
      const target = prev.find((m) => m.id === msgId);
      if (!target) return prev;
      return prev.map((m) => {
        if (m.room !== target.room) return m;
        if (m.id === msgId) return { ...m, pinned: !target.pinned };
        return { ...m, pinned: false };
      });
    });
  };

  const pinnedMsg = roomMessages.find((m) => m.pinned);
  const online = USERS.filter((u) => u.status === "online");

  return (
    <div className="relative rounded-xl border border-line bg-deep/90 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] overflow-hidden">
      {/* window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-line bg-panel">
        <span className="w-2.5 h-2.5 rounded-full bg-signal/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-gold/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-pulse/80" />
        <span className="ml-3 font-mono text-[11px] text-faint tracking-wide">
          yourforum.com/chatbox/
        </span>
        <span className="ml-auto flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-pulse live-dot" /> live · 2.5s poll
        </span>
      </div>

      {/* room tabs */}
      <div className="flex items-center gap-1 px-3 pt-2.5 pb-2 border-b border-line bg-panel/60 overflow-x-auto">
        {ROOMS.map((r) => (
          <button
            key={r.id}
            onClick={() => {
              setActiveRoom(r.id);
              setUnread((u) => ({ ...u, [r.id]: 0 }));
            }}
            className={`group relative shrink-0 px-3 py-1.5 rounded-md font-mono text-[12.5px] transition-all ${
              activeRoom === r.id
                ? "bg-panel2 text-ink border border-line2"
                : "text-dim hover:text-ink border border-transparent hover:border-line"
            }`}
          >
            {r.label}
            {(unread[r.id] || 0) > 0 && (
              <span className="absolute -top-1.5 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-signal text-abyss text-[10px] font-bold flex items-center justify-center">
                {unread[r.id]}
              </span>
            )}
          </button>
        ))}
        <span className="hidden sm:block ml-auto text-[11px] text-faint font-mono">
          {ROOMS.find((r) => r.id === activeRoom)?.desc}
        </span>
      </div>

      <div className="flex">
        {/* feed */}
        <div className="flex-1 min-w-0">
          {/* pinned bar */}
          <div className={`px-4 py-1.5 border-b border-line text-[12px] transition-all ${pinnedMsg ? "bg-gold/[0.06]" : "hidden"}`}>
            {pinnedMsg && (
              <span className="flex items-center gap-2 text-gold">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M16 3a1 1 0 0 1 .7 1.7L15 6.4l.6 4.2 3.7 3.7a1 1 0 0 1-.7 1.7H13l-1 5-1-1-1-4-4.3-4.3a1 1 0 0 1 0-1.4l3-3L9.4 3H16z" />
                </svg>
                <span className="text-dim">Pinned:</span>
                <span className="truncate text-ink/90">{pinnedMsg.text}</span>
              </span>
            )}
          </div>

          <div ref={feedRef} className="chat-scroll h-[340px] sm:h-[380px] overflow-y-auto px-4 py-3 space-y-0.5">
            {roomMessages.map((m) => (
              <MessageRow
                key={m.id}
                m={m}
                onReact={toggleReaction}
                onPin={togglePin}
              />
            ))}
            {typing && typing.room === activeRoom && (
              <div className="flex items-center gap-2 py-1.5 msg-in">
                <span className="text-[12px] text-faint font-mono">{typing.name} is typing</span>
                <span className="flex gap-[3px]">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="typing-dot w-1 h-1 rounded-full bg-dim inline-block"
                      style={{ animationDelay: `${i * 0.18}s` }}
                    />
                  ))}
                </span>
              </div>
            )}
          </div>

          {/* composer */}
          <div className="border-t border-line bg-panel/70 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value.slice(0, MAX_LEN))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={`Message ${ROOMS.find((r) => r.id === activeRoom)?.label} — try /help`}
                className="flex-1 min-w-0 bg-abyss/80 border border-line rounded-lg px-3 py-2 text-[13.5px] text-ink placeholder:text-faint outline-none focus:border-pulse/60 focus:ring-1 focus:ring-pulse/25 transition-all font-body"
                aria-label="Chat message input"
              />
              <button
                onClick={handleSend}
                disabled={!draft.trim()}
                className="shrink-0 h-[38px] px-4 rounded-lg bg-signal text-abyss font-semibold text-[13px] flex items-center gap-2 hover:bg-signal2 active:scale-[0.97] transition-all disabled:opacity-35 disabled:cursor-not-allowed"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 2 11 13" />
                  <path d="M22 2 15 22l-4-9-9-4 20-7z" />
                </svg>
                Send
              </button>
            </div>
            <div className="flex items-center justify-between mt-1.5 px-1">
              <p className="font-mono text-[10px] text-faint tracking-wide">
                /me · /announce · /shrug · /flip · /nick · /clear
              </p>
              <p className={`font-mono text-[10px] ${draft.length > MAX_LEN - 30 ? "text-signal" : "text-faint"}`}>
                {draft.length}/{MAX_LEN}
              </p>
            </div>
          </div>
        </div>

        {/* online rail */}
        <aside className="hidden md:flex flex-col w-[150px] shrink-0 border-l border-line bg-panel/40">
          <p className="px-3 pt-3 pb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
            {online.length + 1} online
          </p>
          <ul className="px-3 space-y-2.5 pb-3 overflow-y-auto chat-scroll">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-pulse" />
              <span className="text-[12.5px] font-medium" style={{ color: ROLE_STYLE.you.color }}>
                {myName}
              </span>
              <span className="ml-auto text-[9px] font-mono text-pulse">you</span>
            </li>
            {USERS.map((u) => (
              <li key={u.name} className="flex items-center gap-2 group cursor-default">
                <span className={`w-1.5 h-1.5 rounded-full ${u.status === "online" ? "bg-pulse" : "bg-gold/60"}`} />
                <span
                  className="text-[12.5px] truncate group-hover:text-ink transition-colors"
                  style={{ color: u.role === "member" ? "var(--color-dim)" : ROLE_STYLE[u.role].color }}
                >
                  {u.name}
                </span>
                {ROLE_STYLE[u.role].badge && (
                  <span
                    className="ml-auto text-[8.5px] font-mono px-1 py-px rounded"
                    style={{ color: ROLE_STYLE[u.role].color, background: ROLE_STYLE[u.role].badgeBg }}
                  >
                    {ROLE_STYLE[u.role].badge}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {/* command feedback toast */}
      <div
        className={`absolute bottom-[86px] left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-md bg-panel2 border border-line2 font-mono text-[11.5px] text-pulse2 shadow-xl transition-all duration-300 ${
          flash ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
        role="status"
      >
        {flash}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Message row                                                         */
/* ------------------------------------------------------------------ */

function MessageRow({
  m,
  onReact,
  onPin,
}: {
  m: ChatMsg;
  onReact: (id: number, emoji: string) => void;
  onPin: (id: number) => void;
}) {
  const [hover, setHover] = useState(false);
  const style = ROLE_STYLE[m.role];

  if (m.command === "system") {
    return (
      <p className="msg-in font-mono text-[11px] text-faint py-1 px-2">{m.text}</p>
    );
  }

  if (m.command === "announce") {
    return (
      <div className="msg-in my-1.5 py-1.5 text-center">
        <span className="inline-block px-3 py-1 rounded-md border border-gold/30 bg-gold/[0.07] text-gold text-[12.5px] font-semibold tracking-wide">
          ⚑ {m.text}
        </span>
      </div>
    );
  }

  const visibleReactions = Object.entries(m.reactions).filter(([k]) => !k.startsWith("__mine"));

  return (
    <div
      className={`msg-in group relative flex gap-2.5 px-2 py-1.5 rounded-lg transition-colors ${
        hover ? "bg-panel2/70" : ""
      }`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* avatar */}
      <span
        className="mt-0.5 w-7 h-7 shrink-0 rounded-md flex items-center justify-center font-display font-semibold text-[12px]"
        style={{ background: `${style.color}1f`, color: style.color, border: `1px solid ${style.color}33` }}
      >
        {m.name.charAt(0).toUpperCase()}
      </span>

      <div className="min-w-0 flex-1">
        <p className="flex items-baseline gap-2 flex-wrap">
          <span className="font-semibold text-[13px]" style={{ color: style.color }}>
            {m.name}
          </span>
          {style.badge && (
            <span
              className="text-[8.5px] font-mono px-1 py-px rounded tracking-wider"
              style={{ color: style.color, background: style.badgeBg }}
            >
              {style.badge}
            </span>
          )}
          {m.pinned && (
            <span className="text-[9px] font-mono text-gold border border-gold/30 rounded px-1">pinned</span>
          )}
          <span className="font-mono text-[10px] text-faint">{m.time}</span>
        </p>
        <p
          className={`text-[13.5px] leading-relaxed break-words ${
            m.command === "me" ? "italic text-pulse2" : "text-ink/85"
          }`}
        >
          {m.command === "me" ? `${m.name} ${m.text}` : m.text}
        </p>

        {visibleReactions.length > 0 && (
          <div className="flex gap-1.5 mt-1">
            {visibleReactions.map(([emoji, count]) => {
              const mine = Boolean(m.reactions[`__mine_${emoji}`]);
              return (
                <button
                  key={emoji}
                  onClick={() => onReact(m.id, emoji)}
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-[11px] transition-all active:scale-90 ${
                    mine
                      ? "border-pulse/50 bg-pulse/10 text-pulse2"
                      : "border-line bg-panel text-dim hover:border-line2"
                  }`}
                >
                  <span>{emoji}</span>
                  <span className="font-mono">{count}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* hover action bar */}
      <div
        className={`absolute -top-2.5 right-2 flex items-center gap-0.5 rounded-md border border-line2 bg-panel px-1 py-0.5 shadow-lg transition-all duration-150 ${
          hover ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {REACTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onReact(m.id, emoji)}
            className="w-6 h-6 rounded hover:bg-panel2 text-[13px] flex items-center justify-center active:scale-90 transition-transform"
            aria-label={`React with ${emoji}`}
          >
            {emoji}
          </button>
        ))}
        <span className="w-px h-4 bg-line2 mx-0.5" />
        <button
          onClick={() => onPin(m.id)}
          className="w-6 h-6 rounded hover:bg-panel2 flex items-center justify-center text-dim hover:text-gold transition-colors"
          aria-label="Pin message"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M16 3a1 1 0 0 1 .7 1.7L15 6.4l.6 4.2 3.7 3.7a1 1 0 0 1-.7 1.7H13l-1 5-1-1-1-4-4.3-4.3a1 1 0 0 1 0-1.4l3-3L9.4 3H16z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
