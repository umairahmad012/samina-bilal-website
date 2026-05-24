"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Download,
  FileCode,
  FileText,
  Search,
} from "lucide-react";

type ManifestFile = {
  path: string;
  name: string;
  size: number;
  description: string;
};

type ManifestCategory = {
  key: string;
  label: string;
  description: string;
  sort: number;
  file_count: number;
  files: ManifestFile[];
};

export type Manifest = {
  generated_at: string;
  total_files: number;
  total_bytes: number;
  categories: ManifestCategory[];
};

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function iconForFile(name: string) {
  if (/\.(sql)$/.test(name)) return FileText;
  if (/\.(tsx?|jsx?|mjs|css|json|toml|yaml|yml|md)$/.test(name)) return FileCode;
  return FileText;
}

export default function FilesBrowser({ manifest }: { manifest: Manifest }) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    // Expand all by default
    const init: Record<string, boolean> = {};
    for (const c of manifest.categories) init[c.key] = true;
    return init;
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return manifest.categories;
    return manifest.categories
      .map((c) => ({
        ...c,
        files: c.files.filter(
          (f) =>
            f.path.toLowerCase().includes(q) ||
            f.name.toLowerCase().includes(q) ||
            f.description.toLowerCase().includes(q),
        ),
      }))
      .filter((c) => c.files.length > 0);
  }, [query, manifest.categories]);

  const totalShown = filtered.reduce((sum, c) => sum + c.files.length, 0);

  return (
    <div>
      {/* Stats + Download All */}
      <div className="admin-card p-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <p className="text-[0.65rem] tracking-[0.32em] uppercase text-ink/55 mb-1.5">
            Source archive
          </p>
          <p className="text-base text-ink/85">
            <span className="font-semibold">{manifest.total_files}</span> files ·{" "}
            <span className="font-semibold">{formatBytes(manifest.total_bytes)}</span>{" "}
            across <span className="font-semibold">{manifest.categories.length}</span>{" "}
            categories
          </p>
          <p className="text-xs text-ink/55 mt-1">
            Last refreshed:{" "}
            {new Date(manifest.generated_at).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
        <a
          href="/files/all.zip"
          download="samina-website-source.zip"
          className="admin-btn inline-flex items-center gap-2 self-start md:self-auto"
        >
          <Download size={16} />
          Download All (.zip)
        </a>
      </div>

      {/* Search */}
      <div className="mb-7 relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search files (path, name, description)…"
          className="admin-input w-full pl-10"
        />
        {query && (
          <p className="text-xs text-ink/55 mt-2">
            Showing <span className="font-semibold">{totalShown}</span> matching
            files
          </p>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-5">
        {filtered.map((cat) => {
          const isOpen = expanded[cat.key] ?? true;
          return (
            <section
              key={cat.key}
              className="admin-card overflow-hidden"
            >
              <button
                type="button"
                onClick={() =>
                  setExpanded((p) => ({ ...p, [cat.key]: !isOpen }))
                }
                className="w-full text-left px-6 py-5 hover:bg-cream-soft/40 transition-colors flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    {isOpen ? (
                      <ChevronDown size={16} className="text-ink/55 shrink-0" />
                    ) : (
                      <ChevronRight size={16} className="text-ink/55 shrink-0" />
                    )}
                    <h2 className="text-base md:text-lg text-ink font-semibold">
                      {cat.label}
                    </h2>
                    <span className="text-[0.65rem] tracking-[0.24em] uppercase text-ink/50 bg-cream-soft px-2.5 py-1 rounded">
                      {cat.files.length} {cat.files.length === 1 ? "file" : "files"}
                    </span>
                  </div>
                  <p className="text-sm text-ink/65 pl-7 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-ink/8 divide-y divide-ink/8">
                  {cat.files.map((file) => {
                    const Icon = iconForFile(file.name);
                    return (
                      <div
                        key={file.path}
                        className="px-6 py-3.5 flex items-start gap-4 hover:bg-cream-soft/30 transition-colors"
                      >
                        <Icon
                          size={16}
                          className="text-ink/45 mt-0.5 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm text-ink font-medium truncate"
                            title={file.path}
                          >
                            {file.name}
                          </p>
                          <p
                            className="text-[11px] text-ink/45 font-mono truncate mt-0.5"
                            title={file.path}
                          >
                            {file.path}
                          </p>
                          {file.description && (
                            <p className="text-xs text-ink/65 mt-1.5 leading-snug">
                              {file.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <span className="text-[11px] text-ink/45 tabular-nums">
                            {formatBytes(file.size)}
                          </span>
                          <a
                            href={`/files/raw/${file.path}`}
                            download={file.name}
                            className="inline-flex items-center gap-1.5 text-xs text-navy hover:text-navy-dark underline underline-offset-2"
                          >
                            <Download size={13} />
                            Download
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}

        {filtered.length === 0 && (
          <div className="admin-card p-10 text-center">
            <p className="text-sm text-ink/65">
              No files match{" "}
              <span className="font-mono">&ldquo;{query}&rdquo;</span>. Try a
              broader search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
