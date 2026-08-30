import BackgroundFX from "./components/BackgroundFX";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Ticker from "./components/Ticker";
import Features from "./components/Features";
import FileExplorer from "./components/FileExplorer";
import InstallGuide from "./components/InstallGuide";
import Pricing from "./components/Pricing";
import Changelog from "./components/Changelog";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import { Reveal } from "./lib/hooks";
import { useDownload } from "./lib/useDownload";

function FinalCta() {
  const { download, state, label } = useDownload();
  return (
    <section className="relative py-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-line2 bg-gradient-to-br from-panel2 via-panel to-deep px-8 py-12 sm:px-14">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(420px 260px at 85% 20%, rgba(255,120,71,0.14), transparent 65%), radial-gradient(380px 240px at 8% 90%, rgba(53,216,183,0.1), transparent 65%)",
              }}
            />
            <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-8 justify-between">
              <div className="max-w-[56ch]">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-pulse2">ready when you are</p>
                <h2 className="mt-2 font-display font-bold text-[30px] sm:text-[40px] leading-[1.04] tracking-tight">
                  Your members are already refreshing the thread.
                  <span className="text-signal"> Give them a chatbox.</span>
                </h2>
                <p className="mt-3 text-[14px] text-dim">
                  Zip it, upload it, done — the archive builds itself right here, then it's a
                  two-minute install in your Admin CP.
                </p>
              </div>
              <div className="flex flex-col gap-3 shrink-0">
                <button
                  onClick={download}
                  className={`h-13 px-7 rounded-lg font-bold text-[15px] flex items-center justify-center gap-2.5 transition-all active:scale-[0.97] min-h-[52px] ${
                    state === "done"
                      ? "bg-pulse/15 border border-pulse/40 text-pulse2"
                      : "bg-signal text-abyss hover:bg-signal2 shadow-[0_16px_40px_-12px_rgba(255,120,71,0.6)]"
                  }`}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
                    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                  </svg>
                  {label}
                </button>
                <a
                  href="https://superchunes.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-center font-mono text-[11.5px] text-faint hover:text-pulse2 transition-colors"
                >
                  or buy the license at superchunes.com →
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <div className="relative min-h-screen">
      <BackgroundFX />
      <div className="relative z-10">
        <Nav />
        <main>
          <Hero />
          <Ticker />
          <Features />
          <FileExplorer />
          <InstallGuide />
          <Pricing />
          <Changelog />
          <Faq />
          <FinalCta />
        </main>
        <Footer />
      </div>
    </div>
  );
}
