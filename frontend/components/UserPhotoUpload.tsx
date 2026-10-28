"use client";

import { useDropzone } from "react-dropzone";

interface Props {
  userPreview: string | null;
  userType: "person" | "room";
  setUserType: (v: "person" | "room") => void;
  onUserDrop: (files: File[]) => void;
  onClear: () => void;
}

export default function UserPhotoUpload({ userPreview, userType, setUserType, onUserDrop, onClear }: Props) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onUserDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
  });

  return (
    <div
      className="glass rounded-2xl flex flex-col h-full"
      style={{ minHeight: "440px" }}
    >
      {/* Card header */}
      <div
        className="flex items-center justify-between px-6 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div>
          <div className="section-label mb-1">Step 02</div>
          <h2 className="text-white font-semibold text-base">Your Photo</h2>
        </div>
        {userPreview && (
          <button onClick={onClear} className="btn-ghost text-xs px-3 py-1.5 rounded-lg">
            Change
          </button>
        )}
      </div>

      <div className="flex-1 p-6 flex flex-col gap-5">
        {/* Mode toggle */}
        <div
          className="flex rounded-xl p-1 gap-1"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          {(["person", "room"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setUserType(type)}
              className="flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all duration-200"
              style={{
                background: userType === type
                  ? "linear-gradient(135deg,#7c3aed,#ec4899)"
                  : "transparent",
                color: userType === type ? "white" : "rgba(255,255,255,0.35)",
              }}
            >
              {type === "person" ? "Wear it" : "Place it in room"}
            </button>
          ))}
        </div>

        {userPreview ? (
          <div className="flex-1 relative rounded-xl overflow-hidden">
            <img
              src={userPreview}
              alt="Your photo"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute bottom-3 left-3"
              style={{
                background: "rgba(16,185,129,0.15)",
                border: "1px solid rgba(16,185,129,0.3)",
                borderRadius: "8px",
                padding: "4px 10px",
              }}
            >
              <span className="text-emerald-400 text-xs font-semibold">Ready</span>
            </div>
          </div>
        ) : (
          <>
            <div
              {...getRootProps()}
              className={`dropzone flex-1 flex flex-col items-center justify-center gap-3 p-8 ${isDragActive ? "dropzone-active" : ""}`}
              style={{ minHeight: "220px" }}
            >
              <input {...getInputProps()} />

              {/* Person/Room icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {userType === "person" ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                )}
              </div>

              <div className="text-center">
                <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {isDragActive ? "Release to upload" : userType === "person" ? "Upload your selfie" : "Upload room photo"}
                </p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>
                  {userType === "person" ? "Clear photo, good lighting" : "Show the placement area"}
                </p>
              </div>
            </div>

            {/* Tips */}
            <div
              className="rounded-xl px-4 py-3"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="section-label mb-2">Best results</p>
              <ul className="space-y-1">
                {(userType === "person"
                  ? ["Well-lit, clear photo", "Plain background works best", "Face visible for clothing"]
                  : ["Well-lit room photo", "Show placement area clearly", "Minimal clutter helps"]
                ).map((tip) => (
                  <li key={tip} className="text-xs flex items-center gap-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                    <div className="w-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.2)", flexShrink: 0 }} />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
