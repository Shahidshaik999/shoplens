"use client";

interface Props {
  steps: string[];
  current: number;
}

export default function StepIndicator({ steps, current }: Props) {
  return (
    <div className="flex items-center justify-center gap-0 my-6">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              {/* Circle */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-400"
                style={{
                  background: done
                    ? "linear-gradient(135deg,#7c3aed,#ec4899)"
                    : active
                    ? "linear-gradient(135deg,#7c3aed,#ec4899)"
                    : "rgba(255,255,255,0.06)",
                  color: done || active ? "white" : "rgba(255,255,255,0.25)",
                  boxShadow: active ? "0 0 0 4px rgba(124,58,237,0.2)" : "none",
                }}
              >
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              {/* Label */}
              <span
                className="text-xs font-medium transition-colors"
                style={{ color: active ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.25)" }}
              >
                {step}
              </span>
            </div>

            {/* Connector */}
            {i < steps.length - 1 && (
              <div
                className="w-20 h-px mx-2 mb-5 transition-all duration-400"
                style={{
                  background: i < current
                    ? "linear-gradient(90deg,#7c3aed,#ec4899)"
                    : "rgba(255,255,255,0.07)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
