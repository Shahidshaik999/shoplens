"use client";

interface CarouselImage {
  image_base64: string;
  image_url: string;
  index: number;
}

interface Props {
  images: CarouselImage[];
  onSelect: (image: CarouselImage) => void;
  onClose: () => void;
}

export default function CarouselPicker({ images, onSelect, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 animate-fade-in"
        style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(16px)" }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full animate-scale-in"
        style={{
          maxWidth: "640px",
          background: "#111111",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <h2 className="text-white font-bold text-base">
              Select a Product
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              {images.length} image{images.length > 1 ? "s" : ""} found in this post — pick the one you want to try on
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.4)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Grid */}
        <div className="p-5">
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: `repeat(${Math.min(images.length, 3)}, 1fr)`,
            }}
          >
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => onSelect(img)}
                className="group relative rounded-xl overflow-hidden animate-fade-up"
                style={{
                  aspectRatio: "1",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  animationDelay: `${i * 50}ms`,
                  transition: "border-color 0.2s, transform 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.5)";
                  (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                  (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                }}
              >
                {/* Image */}
                <img
                  src={`data:image/jpeg;base64,${img.image_base64}`}
                  alt={`Product ${i + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Index badge */}
                <div
                  className="absolute top-2 left-2 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(4px)",
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  {i + 1}
                </div>

                {/* Hover overlay */}
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "rgba(124,58,237,0.2)" }}
                >
                  <div
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white"
                    style={{
                      background: "linear-gradient(135deg,#7c3aed,#ec4899)",
                    }}
                  >
                    Select
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Hint */}
          <p
            className="text-center text-xs mt-4"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            Click any image to use it for your try-on
          </p>
        </div>
      </div>
    </div>
  );
}
