import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShopLens — Virtual Try-On for Instagram",
  description: "See any Instagram product on yourself before buying. AI-powered virtual try-on in seconds.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Background layers */}
        <div className="bg-grid" aria-hidden="true" />
        <div className="bg-grain" aria-hidden="true" />
        <nav
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: "rgba(6,6,10,0.75)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              maxWidth: "1100px",
              margin: "0 auto",
              padding: "0 24px",
              height: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg,#7c3aed,#ec4899)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <span style={{ color: "white", fontWeight: 700, fontSize: "16px", fontFamily: "Inter, sans-serif" }}>
                ShopLens
              </span>
            </div>

            {/* Right */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 12px",
                  borderRadius: "100px",
                  background: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.2)",
                }}
              >
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} />
                <span style={{ color: "#10b981", fontSize: "12px", fontWeight: 600, fontFamily: "Inter, sans-serif" }}>
                  API Live
                </span>
              </div>
            </div>
          </div>
        </nav>
        {/* Light streak under nav */}
        <div className="nav-streak" aria-hidden="true" />
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1a1a1a",
              color: "#f5f5f5",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              fontSize: "14px",
              fontFamily: "Inter, sans-serif",
              padding: "12px 16px",
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "#1a1a1a" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#1a1a1a" },
            },
          }}
        />
      </body>
    </html>
  );
}
