"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";

interface CarouselImage {
  image_base64: string;
  image_url: string;
  index: number;
}

interface Props {
  instagramUrl: string;
  setInstagramUrl: (v: string) => void;
  productPreview: string | null;
  carouselImages: CarouselImage[];
  onProductDrop: (files: File[]) => void;
  onFetchInstagram: () => void;
  onClear: () => void;
  onSelectCarouselImage: (image: CarouselImage) => void;
  onSetInstagramUrl: (v: string) => void;
}

export default function ProductInput({
  instagramUrl,
  setInstagramUrl,
  productPreview,
  carouselImages,
  onProductDrop,
  onFetchInstagram,
  onClear,
  onSelectCarouselImage,
  onSetInstagramUrl,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onProductDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
  });

  // Show carousel picker
  const showCarousel = carouselImages.length > 1 && !productPreview;

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
          <div className="section-label mb-1">Step 01</div>
          <h2 className="text-white font-semibold text-base">
            {showCarousel
              ? `${carouselImages.length} images found — select one`
              : "Product"}
          </h2>
        </div>
        {(productPreview || showCarousel) && (
          <button
            onClick={() => { onClear(); setActiveIndex(0); }}
            className="btn-ghost text-xs px-3 py-1.5 rounded-lg"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex-1 p-6 flex flex-col gap-5">

        {/* ── Carousel picker ──────────────────────────────────────────── */}
        {showCarousel && (
          <div className="flex-1 flex flex-col gap-4">

            {/* Main image preview */}
            <div
              className="relative rounded-xl overflow-hidden flex-1"
              style={{ minHeight: "240px", background: "rgba(255,255,255,0.02)" }}
            >
              <img
                src={`data:image/jpeg;base64,${carouselImages[activeIndex].image_base64}`}
                alt={`Product ${activeIndex + 1}`}
                className="w-full h-full object-contain"
              />

              {/* Prev / Next arrows */}
              {activeIndex > 0 && (
                <button
                  onClick={() => setActiveIndex(i => i - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                  style={{
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                </button>
              )}
              {activeIndex < carouselImages.length - 1 && (
                <button
                  onClick={() => setActiveIndex(i => i + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                  style={{
                    background: "rgba(0,0,0,0.6)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              )}

              {/* Counter badge */}
              <div
                className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-semibold"
                style={{
                  background: "rgba(0,0,0,0.65)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                {activeIndex + 1} / {carouselImages.length}
              </div>
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "thin" }}>
              {carouselImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className="flex-shrink-0 rounded-lg overflow-hidden transition-all"
                  style={{
                    width: "56px",
                    height: "56px",
                    border: i === activeIndex
                      ? "2px solid #7c3aed"
                      : "2px solid rgba(255,255,255,0.08)",
                    opacity: i === activeIndex ? 1 : 0.5,
                    transform: i === activeIndex ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  <img
                    src={`data:image/jpeg;base64,${img.image_base64}`}
                    alt={`Thumb ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Select button */}
            <button
              onClick={() => {
                onSelectCarouselImage(carouselImages[activeIndex]);
                setActiveIndex(0);
              }}
              className="btn-primary w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Use this image
            </button>
          </div>
        )}

        {/* ── Selected product preview ──────────────────────────────── */}
        {productPreview && (
          <div className="flex-1 relative rounded-xl overflow-hidden">
            <img
              src={productPreview}
              alt="Product"
              className="w-full h-full object-contain"
              style={{ background: "rgba(255,255,255,0.02)" }}
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
        )}

        {/* ── Empty state: URL input + upload ──────────────────────── */}
        {!productPreview && !showCarousel && (
          <>
            {/* URL input */}
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="instagram.com/p/..."
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onFetchInstagram()}
                className="input-field px-4 py-3 text-sm"
              />
              <button
                onClick={onFetchInstagram}
                disabled={!instagramUrl.trim()}
                className="btn-primary px-5 py-3 rounded-lg text-sm whitespace-nowrap"
                style={{ borderRadius: "10px" }}
              >
                Fetch
              </button>
            </div>

            {/* Carousel image picker */}
            {instagramUrl.trim() && (
              <div
                className="rounded-xl p-4"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <p className="section-label mb-3">Multi-image post? Pick image number</p>
                <div className="flex flex-wrap gap-2">
                  {[1,2,3,4,5,6,7,8,9,10].map((n) => {
                    const isActive = instagramUrl.includes(`img_index=${n}`);
                    return (
                      <button
                        key={n}
                        onClick={() => {
                          const base = instagramUrl.split("?")[0].replace(/\/$/, "");
                          onSetInstagramUrl(`${base}/?img_index=${n}`);
                        }}
                        className="w-9 h-9 rounded-lg text-sm font-bold transition-all"
                        style={{
                          background: isActive
                            ? "linear-gradient(135deg,#7c3aed,#ec4899)"
                            : "rgba(255,255,255,0.06)",
                          color: isActive ? "white" : "rgba(255,255,255,0.4)",
                          border: isActive ? "none" : "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.2)" }}>
                  Select a number, then click Fetch to get that specific image
                </p>
              </div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
              <span className="section-label">or upload</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.07)" }} />
            </div>

            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`dropzone flex-1 flex flex-col items-center justify-center gap-3 p-8 ${isDragActive ? "dropzone-active" : ""}`}
              style={{ minHeight: "180px" }}
            >
              <input {...getInputProps()} />
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {isDragActive ? "Release to upload" : "Drop product image here"}
                </p>
                <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.2)" }}>
                  JPG, PNG, WebP
                </p>
              </div>
            </div>

            {/* Supported tags */}
            <div className="flex flex-wrap gap-2">
              {["Clothing", "Shoes", "Glasses", "Bags", "Watches", "Furniture"].map((item) => (
                <span key={item} className="tag">{item}</span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
