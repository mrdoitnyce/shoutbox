const ITEMS = [
  "ROOMS & CHANNELS",
  "/me /announce /flip",
  "FLOOD CONTROL",
  "TIMED BANS",
  "PIN PER ROOM",
  "DISCORD WEBHOOK BRIDGE",
  "GUEST MODE",
  "SIDEBAR WIDGET",
  "FULL-PAGE ROUTE",
  "XF PUSH-NOTIFY READY",
  "MOBILE FIRST",
  "MESSAGE PRUNING",
];

export default function Ticker() {
  const row = (key: string) => (
    <div key={key} className="flex items-center shrink-0">
      {ITEMS.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="px-5 font-mono text-[12px] tracking-[0.22em] text-dim whitespace-nowrap">
            {item}
          </span>
          <svg width="9" height="9" viewBox="0 0 10 10" aria-hidden="true" className={i % 2 === 0 ? "text-signal" : "text-pulse"}>
            <path d="M5 0l1.4 3.6L10 5 6.4 6.4 5 10 3.6 6.4 0 5l3.6-1.4z" fill="currentColor" />
          </svg>
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative border-y border-line bg-deep/60 py-3 overflow-hidden">
      <div className="flex ticker-track w-max">
        {row("a")}
        {row("b")}
      </div>
      {/* edge fades */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-abyss to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-abyss to-transparent pointer-events-none" />
    </div>
  );
}
