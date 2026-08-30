import { useCallback, useState } from "react";
import { downloadChatboxPro, formatBytes, type ZipStats } from "./downloadZip";

export function useDownload() {
  const [state, setState] = useState<"idle" | "working" | "done">("idle");
  const [stats, setStats] = useState<ZipStats | null>(null);

  const download = useCallback(async () => {
    if (state === "working") return;
    setState("working");
    try {
      const s = await downloadChatboxPro();
      setStats(s);
      setState("done");
    } catch {
      setState("idle");
    }
  }, [state]);

  const label =
    state === "working"
      ? "Packaging…"
      : state === "done" && stats
        ? `${stats.name} · ${formatBytes(stats.bytes)} — again?`
        : "Download v1.0.1 (.zip)";

  return { download, state, label, stats };
}
