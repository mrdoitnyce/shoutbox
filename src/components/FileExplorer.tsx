import { useMemo, useState } from "react";
import { ADDON_FILES, ADDON_META, README } from "../addon/zipFiles";
import { Reveal } from "../lib/hooks";

interface TreeNode {
  name: string;
  path: string;
  children: Map<string, TreeNode>;
  content?: string;
}

function buildTree(): TreeNode {
  const root: TreeNode = { name: `SC_ChatboxPRO_${ADDON_META.version}.zip`, path: "", children: new Map() };
  const entries: [string, string][] = [["README.md", README], ...Object.entries(ADDON_FILES)];

  for (const [path, content] of entries) {
    const parts = path.split("/");
    let cur = root;
    parts.forEach((part, i) => {
      const isFile = i === parts.length - 1;
      if (!cur.children.has(part)) {
        cur.children.set(part, {
          name: part,
          path: parts.slice(0, i + 1).join("/"),
          children: new Map(),
          content: isFile ? content : undefined,
        });
      }
      cur = cur.children.get(part)!;
    });
  }
  return root;
}

const enc = new TextEncoder();

function FileRow({
  node,
  depth,
  open,
  selected,
  onToggle,
  onSelect,
}: {
  node: TreeNode;
  depth: number;
  open: Set<string>;
  selected: string;
  onToggle: (path: string) => void;
  onSelect: (node: TreeNode) => void;
}) {
  const isDir = node.children.size > 0;
  const isOpen = open.has(node.path);
  const isSel = selected === node.path;

  const sorted = useMemo(() => {
    const arr = [...node.children.values()];
    arr.sort((a, b) => {
      const ad = a.children.size > 0 ? 0 : 1;
      const bd = b.children.size > 0 ? 0 : 1;
      return ad - bd || a.name.localeCompare(b.name);
    });
    return arr;
  }, [node]);

  return (
    <div>
      <button
        onClick={() => (isDir ? onToggle(node.path) : onSelect(node))}
        className={`w-full flex items-center gap-1.5 py-[5px] pr-2 rounded-md font-mono text-[12px] transition-colors ${
          isSel ? "bg-signal/12 text-signal2" : "text-dim hover:text-ink hover:bg-panel2/70"
        }`}
        style={{ paddingLeft: `${10 + depth * 14}px` }}
      >
        {isDir ? (
          <>
            <svg width="9" height="9" viewBox="0 0 10 10" fill="currentColor" className={`transition-transform ${isOpen ? "rotate-90" : ""}`}>
              <path d="M3 1l5 4-5 4z" />
            </svg>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFC24B" strokeWidth="2" className="shrink-0">
              <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
            </svg>
          </>
        ) : (
          <>
            <span className="w-[9px] shrink-0" />
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={node.name.endsWith(".php") ? "#FF7847" : node.name.endsWith(".xml") ? "#35D8B7" : "#8CA2C6"} strokeWidth="2" className="shrink-0">
              <path d="M14 3v5h5M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5z" />
            </svg>
          </>
        )}
        <span className="truncate">{node.name}</span>
        {!isDir && (
          <span className="ml-auto text-[10px] text-faint shrink-0">
            {(enc.encode(node.content || "").length / 1024).toFixed(1)}k
          </span>
        )}
      </button>
      {isDir && isOpen && sorted.map((child) => (
        <FileRow key={child.path} node={child} depth={depth + 1} open={open} selected={selected} onToggle={onToggle} onSelect={onSelect} />
      ))}
    </div>
  );
}

const DEFAULT_FILE = "upload/src/addons/SC/ChatboxPRO/Setup.php";

export default function FileExplorer() {
  const tree = useMemo(buildTree, []);
  const [open, setOpen] = useState<Set<string>>(
    () =>
      new Set([
        "",
        "upload",
        "upload/src",
        "upload/src/addons",
        "upload/src/addons/SC",
        "upload/src/addons/SC/ChatboxPRO",
      ])
  );
  const [selected, setSelected] = useState<TreeNode | null>(null);

  const sel = selected ?? tree.children.get("upload")!.children.get("src")!.children.get("addons")!.children.get("SC")!.children.get("ChatboxPRO")!.children.get("Setup.php")!;

  const selPath = sel.path || DEFAULT_FILE;
  const preview = (sel.content || "").split("\n");
  const shown = preview.slice(0, 42);

  return (
    <section id="package" className="relative py-20 scroll-mt-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-signal">ship-ready package</p>
              <h2 className="mt-2 font-display font-bold text-[34px] sm:text-[44px] leading-[1.02] tracking-tight max-w-[20ch]">
                Open the zip before <span className="text-dim">you buy it.</span>
              </h2>
            </div>
            <p className="max-w-[40ch] text-[14px] text-dim leading-relaxed">
              Standard XenForo add-on layout: <span className="font-mono text-[12.5px] text-pulse2">upload/</span> root,
              entities, finders, services, <span className="font-mono text-[12.5px] text-pulse2">_data</span> imports and
              the client JS. Click any file.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="grid lg:grid-cols-[340px_1fr] gap-4">
            {/* tree */}
            <div className="rounded-xl border border-line bg-panel/60 p-3 overflow-auto chat-scroll max-h-[560px]">
              <div className="flex items-center justify-between px-2 pb-2 border-b border-line mb-2">
                <span className="font-mono text-[11px] text-faint tracking-wider">PACKAGE CONTENTS</span>
                <span className="font-mono text-[10px] text-pulse2">{Object.keys(ADDON_FILES).length + 1} files</span>
              </div>
              {[...tree.children.values()].map((n) => (
                <FileRow
                  key={n.path}
                  node={n}
                  depth={0}
                  open={open}
                  selected={sel.path}
                  onToggle={(p) =>
                    setOpen((prev) => {
                      const next = new Set(prev);
                      if (next.has(p)) next.delete(p);
                      else next.add(p);
                      return next;
                    })
                  }
                  onSelect={setSelected}
                />
              ))}
            </div>

            {/* preview */}
            <div className="rounded-xl border border-line bg-abyss/80 overflow-hidden flex flex-col min-h-[420px]">
              <div className="flex items-center gap-3 px-4 py-2.5 border-b border-line bg-panel/70">
                <span className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-signal/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-gold/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-pulse/70" />
                </span>
                <span className="font-mono text-[11.5px] text-dim truncate">{selPath}</span>
                <span className="ml-auto font-mono text-[10px] text-faint shrink-0">
                  {preview.length} lines · {(enc.encode(sel.content || "").length / 1024).toFixed(1)} KB
                </span>
              </div>
              <pre className="flex-1 overflow-auto chat-scroll p-4 font-mono text-[11.5px] leading-[1.65] text-dim">
                {shown.map((line, i) => (
                  <div key={i} className="flex">
                    <span className="w-8 shrink-0 text-right pr-3 text-faint/60 select-none">{i + 1}</span>
                    <span
                      className={
                        line.trim().startsWith("<?php") || line.trim().startsWith("<?xml")
                          ? "text-signal2"
                          : line.trim().startsWith("*") || line.trim().startsWith("//") || line.trim().startsWith("#") || line.trim().startsWith("/*")
                            ? "text-faint italic"
                            : line.includes("function ") || line.includes("class ") || line.includes("namespace ")
                              ? "text-pulse2"
                              : ""
                      }
                    >
                      {line || " "}
                    </span>
                  </div>
                ))}
                {preview.length > 42 && (
                  <div className="flex">
                    <span className="w-8 shrink-0" />
                    <span className="text-faint">… {preview.length - 42} more lines in the archive</span>
                  </div>
                )}
              </pre>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
