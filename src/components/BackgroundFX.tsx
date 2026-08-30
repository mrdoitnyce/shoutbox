const GLYPHS: { ch: string; top: string; left: string; size: number; dur: number }[] = [
  { ch: "<xf:if>", top: "14%", left: "6%", size: 13, dur: 11 },
  { ch: "{xenforo}", top: "22%", left: "88%", size: 12, dur: 14 },
  { ch: "SC\\ChatboxPRO", top: "58%", left: "4%", size: 11, dur: 13 },
  { ch: "</chat>", top: "70%", left: "90%", size: 13, dur: 10 },
  { ch: "xf_sc_chat_message", top: "84%", left: "12%", size: 11, dur: 15 },
  { ch: "::poll()", top: "38%", left: "94%", size: 12, dur: 12 },
  { ch: "/announce", top: "90%", left: "70%", size: 12, dur: 11 },
  { ch: "version_id", top: "8%", left: "48%", size: 11, dur: 16 },
];

export default function BackgroundFX() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* base vignette washes — layered, multi-hue */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 520px at 12% -6%, rgba(255,120,71,0.09), transparent 62%)," +
            "radial-gradient(1000px 640px at 92% 4%, rgba(53,216,183,0.075), transparent 60%)," +
            "radial-gradient(800px 700px at 55% 108%, rgba(255,194,75,0.05), transparent 60%)",
        }}
      />
      {/* blueprint grid */}
      <div className="absolute inset-0 fx-grid" />
      {/* drifting template glyphs */}
      {GLYPHS.map((g, i) => (
        <span
          key={i}
          className="fx-glyph"
          style={{
            top: g.top,
            left: g.left,
            fontSize: g.size,
            animationDuration: `${g.dur}s`,
            animationDelay: `${i * 0.7}s`,
          }}
        >
          {g.ch}
        </span>
      ))}
      {/* grain */}
      <div className="absolute inset-0 fx-noise" />
    </div>
  );
}
