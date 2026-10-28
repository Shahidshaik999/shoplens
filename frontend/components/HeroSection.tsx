"use client";

export default function HeroSection() {
  return (
    <div className="pt-16 pb-12 text-center relative">

      {/* Badge */}
      <div className="relative inline-flex items-center gap-2 mb-8">
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            background: "rgba(124,58,237,0.1)",
            border: "1px solid rgba(124,58,237,0.25)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full bg-violet-400"
            style={{ animation: "pulse-ring 2s infinite" }}
          />
          <span className="text-violet-300 text-xs font-semibold tracking-wide">
            AI-Powered Virtual Try-On
          </span>
        </div>
      </div>

      {/* Headline */}
      <div className="relative animate-fade-up">
        <h1
          className="font-black leading-none tracking-tighter mb-4"
          style={{ fontSize: "clamp(48px, 8vw, 88px)" }}
        >
          <span className="text-white">Try before</span>
          <br />
          <span className="gradient-text">you buy.</span>
        </h1>

        <p
          className="mx-auto text-lg leading-relaxed"
          style={{
            color: "rgba(255,255,255,0.45)",
            maxWidth: "500px",
            fontWeight: 400,
          }}
        >
          See any Instagram product on yourself in seconds.
          No more guessing. No more returns.
        </p>
      </div>

      {/* Feature pills */}
      <div
        className="relative flex items-center justify-center gap-3 mt-8 animate-fade-up"
        style={{ animationDelay: "100ms" }}
      >
        <FeaturePill label="Instant try-on" color="#7c3aed" />
        <div style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.1)" }} />
        <FeaturePill label="Any clothing" color="#ec4899" />
        <div style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.1)" }} />
        <FeaturePill label="Any room" color="#f97316" />
      </div>

      {/* Stats row */}
      <div
        className="relative flex items-center justify-center gap-10 mt-10 animate-fade-up"
        style={{ animationDelay: "180ms" }}
      >
        {[
          { value: "2B+", label: "Instagram users" },
          { value: "70%", label: "Returns from bad fit" },
          { value: "~10s", label: "Time to try-on" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div
              className="font-black text-2xl gradient-text"
              style={{ letterSpacing: "-0.5px" }}
            >
              {s.value}
            </div>
            <div
              className="text-xs mt-1"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturePill({ label, color }: { label: string; color: string }) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
      style={{
        background: `${color}12`,
        border: `1px solid ${color}30`,
      }}
    >
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      <span className="text-xs font-semibold" style={{ color: `${color}cc` }}>
        {label}
      </span>
    </div>
  );
}
