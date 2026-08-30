import JSZip from "jszip";
import { ADDON_FILES, ADDON_META, README } from "../addon/zipFiles";

export interface ZipStats {
  bytes: number;
  files: number;
  name: string;
}

export async function buildChatboxZip(): Promise<{ blob: Blob; stats: ZipStats }> {
  const zip = new JSZip();
  zip.file("README.md", README);
  zip.file("CHANGELOG.md", ADDON_FILES["CHANGELOG.md"]);

  for (const [path, content] of Object.entries(ADDON_FILES)) {
    if (path === "CHANGELOG.md") continue; // already at root
    zip.file(path, content);
  }

  const blob = await zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
  });

  const name = `SC_ChatboxPRO_${ADDON_META.version}.zip`;
  return { blob, stats: { bytes: blob.size, files: Object.keys(ADDON_FILES).length + 1, name } };
}

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export async function downloadChatboxPro(): Promise<ZipStats> {
  const { blob, stats } = await buildChatboxZip();
  triggerDownload(blob, stats.name);
  return stats;
}

/** Byte-accurate size of every entry, for the package explorer. */
export function getPackageStats() {
  const enc = new TextEncoder();
  let bytes = enc.encode(README).length;
  let files = 1;
  for (const [path, content] of Object.entries(ADDON_FILES)) {
    bytes += enc.encode(content).length;
    files += 1;
    void path;
  }
  return { bytes, files };
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  return `${(n / 1024).toFixed(1)} KB`;
}
