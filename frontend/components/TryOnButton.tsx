"use client";

interface Props {
  ready: boolean;
  loading: boolean;
  loadingStep: string;
  onClick: () => void;
}

export default function TryOnButton({ ready, loading, loadingStep, onClick }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 my-12">
      <div className="relative">
        {/* Glow behind button when ready */}
        {ready && !loading && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: "linear-gradient(135deg,#7c3aed,#ec4899)",
              filter: "blur(20px)",
              opacity: 0.35,
              transform: "scale(1.1)",
            }}
          />
        )}

        <button
          onClick={onClick}
          disabled={!ready || loading}
          className="relative btn-primary rounded-2xl font-bold tracking-wide transition-all"
          style={{
            padding: "18px 64px",
            fontSize: "16px",
            letterSpacing: "0.3px",
            minWidth: "260px",
          }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3">
              <span
                className="w-5 h-5 rounded-full border-2 animate-spin"
                style={{ borderColor: "rgba(255,255,255,0.2)", borderTopColor: "white" }}
              />
              Generating...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              Generate Try-On
            </span>
          )}
        </button>
      </div>

      {/* Loading step */}
      {loading && loadingStep && (
        <div className="flex items-center gap-2">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: "#7c3aed",
              animation: "pulse-ring 1.5s infinite",
            }}
          />
          <span className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            {loadingStep}
          </span>
        </div>
      )}

      {/* Hint */}
      {!ready && !loading && (
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          Complete both steps above to generate
        </p>
      )}

      {/* Subtle divider line */}
      {!loading && (
        <div style={{ width: "40px", height: "1px", background: "rgba(255,255,255,0.06)" }} />
      )}
    </div>
  );
}
