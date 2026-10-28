"use client";

import type { HistoryItem } from "@/app/page";

interface Props {
  history: HistoryItem[];
  onView: (item: HistoryItem) => void;
  onClear: () => void;
}

export default function HistoryPanel({ history, onView, onClear }: Props) {
  if (history.length === 0) return null;

  return (
    <div className="mt-4 mb-4 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="section-label">Session History</span>
          <div
            className="px-2 py-0.5 rounded-full text-xs font-bold"
            style={{
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(124,58,237,0.2)",
              color: "#a78bfa",
            }}
          >
            {history.length}
          </div>
        </div>
        <button
          onClick={onClear}
          className="text-xs transition-colors"
          style={{ color: "rgba(255,255,255,0.2)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
        >
          Clear all
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {history.map((item, index) => (
          <HistoryCard
            key={item.id}
            item={item}
            index={index}
            onClick={() => onView(item)}
          />
        ))}
      </div>
    </div>
  );
}

function HistoryCard({ item, index, onClick }: { item: HistoryItem; index: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative rounded-xl overflow-hidden animate-fade-up"
      style={{
        aspectRatio: "1",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        animationDelay: `${index * 60}ms`,
        transition: "border-color 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.4)";
        (e.currentTarget as HTMLElement).style.transform = "scale(1.03)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
        (e.currentTarget as HTMLElement).style.transform = "scale(1)";
      }}
    >
      {/* Result image */}
      <img
        src={`data:image/jpeg;base64,${item.result.result_image_base64}`}
        alt={item.result.product_name}
        className="w-full h-full object-cover"
      />

      {/* Gradient overlay — always */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
        }}
      />

      {/* Product thumbnail top-left */}
      {item.productPreview && (
        <div
          className="absolute top-2 left-2 w-7 h-7 rounded-lg overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.15)" }}
        >
          <img src={item.productPreview} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Timestamp top-right */}
      <div
        className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md text-xs"
        style={{
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
          color: "rgba(255,255,255,0.5)",
          fontSize: "10px",
        }}
      >
        {item.timestamp}
      </div>

      {/* Product name bottom */}
      <div className="absolute bottom-0 left-0 right-0 px-2 pb-2">
        <p
          className="text-xs font-medium truncate"
          style={{ color: "rgba(255,255,255,0.8)" }}
        >
          {item.result.product_name}
        </p>
        <p
          className="text-xs capitalize truncate"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          {item.result.product_category}
        </p>
      </div>

      {/* View overlay on hover */}
      <div
        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: "rgba(124,58,237,0.15)" }}
      >
        <div
          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
          style={{
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          View
        </div>
      </div>
    </button>
  );
}
