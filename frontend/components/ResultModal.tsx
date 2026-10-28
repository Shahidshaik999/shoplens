"use client";

import { useEffect, useState } from "react";
import type { TryOnResult } from "@/app/page";

interface Props {
  result: TryOnResult;
  productPreview: string | null;
  userPreview: string | null;
  onClose: () => void;
  onReset: () => void;
}

export default function ResultModal({ result, productPreview, userPreview, onClose, onReset }: Props) {
  const [showOriginal, setShowOriginal] = useState(false);
  const [downloaded, setDownloaded]     = useState(false);
  const resultSrc = `data:image/jpeg;base64,${result.result_image_base64}`;
  const hasFit = !!(result.fit_verdict && result.fit_verdict !== "" && result.fit_verdict !== "Cannot assess" && result.fit_score > 0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  function handleDownload() {
    const a = document.createElement("a");
    a.href = resultSrc;
    a.download = `shoplens-${Date.now()}.jpg`;
    a.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  }

  function handleShare() {
    if (navigator.share) {
      fetch(resultSrc).then(r => r.blob()).then(blob => {
        const file = new File([blob], "shoplens-tryon.jpg", { type: "image/jpeg" });
        navigator.share({ files: [file], title: "My ShopLens Try-On" });
      });
    } else {
      handleDownload();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 animate-fade-in"
        style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(20px)" }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full animate-scale-in overflow-y-auto"
        style={{
          maxWidth: "1000px",
          maxHeight: "92vh",
          background: "#111111",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-7 py-5 sticky top-0 z-10"
          style={{
            background: "#111111",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div>
            <h2 className="text-white font-bold text-lg">Try-On Result</h2>
            <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              {result.product_name}
              <span
                className="ml-2 px-2 py-0.5 rounded-full text-xs capitalize"
                style={{
                  background: "rgba(124,58,237,0.12)",
                  border: "1px solid rgba(124,58,237,0.2)",
                  color: "#a78bfa",
                }}
              >
                {result.product_category}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* ── Left: Image viewer ────────────────────────────────────────── */}
          <div className="p-6" style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}>

            {/* Toggle */}
            <div
              className="flex rounded-xl p-1 gap-1 mb-4"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              {["Try-On", "Original"].map((label, i) => (
                <button
                  key={label}
                  onClick={() => setShowOriginal(i === 1)}
                  className="flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: (i === 1) === showOriginal ? "rgba(255,255,255,0.08)" : "transparent",
                    color: (i === 1) === showOriginal ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Image */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ aspectRatio: "1", background: "rgba(255,255,255,0.02)" }}
            >
              <img
                src={showOriginal ? (userPreview || resultSrc) : resultSrc}
                alt="Result"
                className="w-full h-full object-cover"
                style={{ transition: "opacity 0.3s" }}
              />
              {!showOriginal && (
                <div
                  className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: "linear-gradient(135deg,#7c3aed,#ec4899)" }} />
                  <span className="text-xs text-white font-medium">AI Generated</span>
                </div>
              )}
            </div>

            {/* SAM segments shown as tags under image */}
            {result.sam_segments && result.sam_segments.length > 0 && (
              <div className="mt-4">
                <p className="section-label mb-2">Segments detected by SAM 3.1</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.sam_segments.map((seg, i) => (
                    <span
                      key={i}
                      className="text-xs px-2.5 py-1 rounded-full"
                      style={{
                        background: "rgba(124,58,237,0.1)",
                        border: "1px solid rgba(124,58,237,0.2)",
                        color: "#a78bfa",
                      }}
                    >
                      {seg}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Analysis + actions ─────────────────────────────────── */}
          <div className="p-6 flex flex-col gap-4">

            {/* Product reference */}
            {productPreview && (
              <div
                className="flex items-center gap-4 rounded-xl p-4"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={productPreview} alt="Product" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{result.product_name}</p>
                  <p className="text-xs mt-0.5 capitalize" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {result.product_category}
                  </p>
                  <p className="text-xs mt-1 line-clamp-2" style={{ color: "rgba(255,255,255,0.25)" }}>
                    {result.product_description}
                  </p>
                </div>
              </div>
            )}

            {/* ── Fit Analysis card ─────────────────────────────────────── */}
            {hasFit && (
              <div
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {/* Header */}
                <div
                  className="px-4 py-3 flex items-center justify-between"
                  style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    <span className="text-xs font-bold text-white">Fit Analysis</span>
                  </div>
                  <FitScore score={result.fit_score} />
                </div>

                <div className="px-4 py-3 flex flex-col gap-3">
                  {/* Verdict */}
                  <div className="flex items-center gap-2">
                    <FitVerdictBadge verdict={result.fit_verdict} />
                    {result.fit_confidence && (
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {result.fit_confidence} confidence
                      </span>
                    )}
                  </div>

                  {/* Issues */}
                  {result.fit_issues && result.fit_issues.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      {result.fit_issues.map((issue, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div
                            className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                            style={{ background: "#f59e0b" }}
                          />
                          <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                            {issue}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Size recommendation */}
                  {result.size_recommendation && (
                    <div
                      className="flex items-start gap-2 rounded-lg px-3 py-2.5"
                      style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span className="text-xs font-medium" style={{ color: "#10b981" }}>
                        {result.size_recommendation}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Style Note ─────────────────────────────────────────────── */}
            {result.style_note && (
              <div
                className="rounded-xl px-4 py-3 flex items-start gap-3"
                style={{ background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.18)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <div>
                  <p className="text-xs font-semibold mb-0.5" style={{ color: "#f97316" }}>Style Note</p>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {result.style_note}
                  </p>
                </div>
              </div>
            )}

            {/* ── Pipeline used ──────────────────────────────────────────── */}
            <div
              className="rounded-xl p-3"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
            >
              <p className="section-label mb-2.5">Pipeline</p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { step: "01", label: "Muse Spark", sub: "Product analysis" },
                  { step: "02", label: "SAM 3.1", sub: "Segmentation" },
                  { step: "03", label: "Muse Image", sub: "Try-on generation" },
                  { step: "04", label: "Muse Wonder", sub: "Fit analysis" },
                ].map((s) => (
                  <div
                    key={s.step}
                    className="rounded-lg p-2 text-center"
                    style={{ background: "rgba(255,255,255,0.03)" }}
                  >
                    <p className="text-xs font-bold gradient-text">{s.step}</p>
                    <p className="text-xs font-semibold text-white mt-0.5">{s.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.25)", fontSize: "10px" }}>{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Actions ────────────────────────────────────────────────── */}
            <div className="flex flex-col gap-3 mt-auto">
              <button
                onClick={handleShare}
                className="btn-primary w-full py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                Share to Instagram Stories
              </button>

              <button
                onClick={handleDownload}
                className="btn-ghost w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                {downloaded ? "Downloaded!" : "Download Image"}
              </button>

              <button
                onClick={onReset}
                className="text-sm py-2 transition-colors"
                style={{ color: "rgba(255,255,255,0.25)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
              >
                Try another product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function FitScore({ score }: { score: number }) {
  if (!score || score <= 0) return null;
  const color =
    score >= 8 ? "#10b981" :
    score >= 6 ? "#f59e0b" :
    score >= 4 ? "#f97316" : "#ef4444";

  return (
    <div className="flex items-center gap-2">
      {/* Score bar */}
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ width: "60px", background: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${score * 10}%`,
            background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          }}
        />
      </div>
      <span className="text-xs font-bold" style={{ color }}>
        {score}/10
      </span>
    </div>
  );
}

function FitVerdictBadge({ verdict }: { verdict: string }) {
  if (!verdict) return null;
  const v      = verdict.toLowerCase();
  const isGood = v.includes("perfect") || v.includes("good");
  const isWarn = v.includes("slightly");
  const color  = isGood ? "#10b981" : isWarn ? "#f59e0b" : "#ef4444";
  const bg     = isGood ? "rgba(16,185,129,0.1)" : isWarn ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)";
  const border = isGood ? "rgba(16,185,129,0.25)" : isWarn ? "rgba(245,158,11,0.25)" : "rgba(239,68,68,0.25)";

  return (
    <span
      className="text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ background: bg, border: `1px solid ${border}`, color }}
    >
      {verdict || "Analyzed"}
    </span>
  );
}
