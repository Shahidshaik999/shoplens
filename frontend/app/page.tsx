"use client";

import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import ResultModal from "@/components/ResultModal";
import StepIndicator from "@/components/StepIndicator";
import HeroSection from "@/components/HeroSection";
import ProductInput from "@/components/ProductInput";
import UserPhotoUpload from "@/components/UserPhotoUpload";
import TryOnButton from "@/components/TryOnButton";
import HistoryPanel from "@/components/HistoryPanel";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type TryOnResult = {
  result_image_base64: string;
  product_name: string;
  product_category: string;
  product_description: string;
  try_on_type: string;
  // Fit analysis
  fit_score: number;
  fit_verdict: string;
  fit_issues: string[];
  size_recommendation: string;
  style_note: string;
  fit_confidence: string;
  sam_segments: string[];
};

export type HistoryItem = {
  id: string;
  result: TryOnResult;
  productPreview: string | null;
  userPreview: string | null;
  timestamp: string;
};

export type CarouselImage = {
  image_base64: string;
  image_url: string;
  index: number;
};

export default function Home() {
  // Product
  const [instagramUrl, setInstagramUrl]   = useState("");
  const [productImage, setProductImage]   = useState<string | null>(null);
  const [productPreview, setProductPreview] = useState<string | null>(null);

  // Carousel
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);

  // User photo
  const [userImage, setUserImage]   = useState<string | null>(null);
  const [userPreview, setUserPreview] = useState<string | null>(null);
  const [userType, setUserType]     = useState<"person" | "room">("person");

  // UI
  const [loading, setLoading]       = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [result, setResult]         = useState<TryOnResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  // History
  const [history, setHistory]                   = useState<HistoryItem[]>([]);
  const [activeProductPreview, setActiveProductPreview] = useState<string | null>(null);
  const [activeUserPreview, setActiveUserPreview]       = useState<string | null>(null);

  // ─── Helpers ────────────────────────────────────────────────────────────────

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function nowTime() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function clearProduct() {
    setProductImage(null);
    setProductPreview(null);
    setInstagramUrl("");
    setCarouselImages([]);
  }

  // ─── Product drop ────────────────────────────────────────────────────────────

  const onProductDrop = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const b64 = await fileToBase64(file);
    setProductImage(b64);
    setProductPreview(URL.createObjectURL(file));
    setInstagramUrl("");
    setCarouselImages([]);
    toast.success("Product uploaded!");
  }, []);

  // ─── User photo drop ─────────────────────────────────────────────────────────

  const onUserDrop = useCallback(async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    const b64 = await fileToBase64(file);
    setUserImage(b64);
    setUserPreview(URL.createObjectURL(file));
    toast.success("Photo uploaded!");
  }, []);

  // ─── Fetch Instagram ─────────────────────────────────────────────────────────

  async function handleFetchInstagram() {
    if (!instagramUrl.trim()) return;
    const t = toast.loading("Fetching from Instagram...");
    try {
      const res = await axios.post(`${API}/fetch-instagram`, { url: instagramUrl });
      const { images, count, is_carousel } = res.data;

      if (!images || images.length === 0) {
        toast.error("No images found. Upload directly.", { id: t });
        return;
      }

      if (is_carousel && images.length > 1) {
        // Show inline carousel in ProductInput
        setCarouselImages(images);
        setProductImage(null);
        setProductPreview(null);
        toast.success(`${count} images found — swipe to pick one`, { id: t });
      } else {
        // Single image
        setProductImage(images[0].image_base64);
        setProductPreview(`data:image/jpeg;base64,${images[0].image_base64}`);
        setCarouselImages([]);
        toast.success("Product fetched!", { id: t });
      }
    } catch (e: any) {
      toast.error(
        e?.response?.data?.detail || "Could not fetch. Upload directly.",
        { id: t }
      );
    }
  }

  // ─── Carousel image selected ──────────────────────────────────────────────

  function handleSelectCarouselImage(image: CarouselImage) {
    setProductImage(image.image_base64);
    setProductPreview(`data:image/jpeg;base64,${image.image_base64}`);
    setCarouselImages([]);
    toast.success("Product selected!");
  }

  // ─── Main try-on ──────────────────────────────────────────────────────────────

  async function handleTryOn() {
    if (!userImage)  { toast.error("Upload your photo first"); return; }
    if (!productImage) { toast.error("Select a product first"); return; }

    setLoading(true);
    setResult(null);

    const snapProduct = productPreview;
    const snapUser    = userPreview;

    try {
      setLoadingStep("Analyzing product with Muse Spark...");
      await new Promise(r => setTimeout(r, 500));
      setLoadingStep("Segmenting with SAM 3.1...");
      await new Promise(r => setTimeout(r, 500));
      setLoadingStep("Compositing with Muse Image...");
      await new Promise(r => setTimeout(r, 500));
      setLoadingStep("Analyzing fit with Muse Wonder...");

      const res = await axios.post(
        `${API}/try-on`,
        { product_image_base64: productImage, user_image_base64: userImage, user_type: userType },
        { timeout: 180000 }
      );
      const data: TryOnResult = res.data;

      // Add to history
      setHistory(prev => [{
        id: `${Date.now()}`,
        result: data,
        productPreview: snapProduct,
        userPreview: snapUser,
        timestamp: nowTime(),
      }, ...prev]);

      setActiveProductPreview(snapProduct);
      setActiveUserPreview(snapUser);
      setResult(data);
      setShowResult(true);
      toast.success("Try-on ready!");
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || e?.message || "Try-on failed. Try again.");
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  }

  function handleViewHistory(item: HistoryItem) {
    setActiveProductPreview(item.productPreview);
    setActiveUserPreview(item.userPreview);
    setResult(item.result);
    setShowResult(true);
  }

  const isReady = !!(userImage && productImage);

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <main className="min-h-screen" style={{ position: "relative", zIndex: 1 }}>
      <div className="max-w-6xl mx-auto px-4 py-8">

        <HeroSection />

        <StepIndicator
          steps={["Add Product", "Add Your Photo", "Try It On"]}
          current={!productImage && carouselImages.length === 0 ? 0 : !userImage ? 1 : 2}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <ProductInput
            instagramUrl={instagramUrl}
            setInstagramUrl={setInstagramUrl}
            productPreview={productPreview}
            carouselImages={carouselImages}
            onProductDrop={onProductDrop}
            onFetchInstagram={handleFetchInstagram}
            onClear={clearProduct}
            onSelectCarouselImage={handleSelectCarouselImage}
            onSetInstagramUrl={setInstagramUrl}
          />
          <UserPhotoUpload
            userPreview={userPreview}
            userType={userType}
            setUserType={setUserType}
            onUserDrop={onUserDrop}
            onClear={() => { setUserImage(null); setUserPreview(null); }}
          />
        </div>

        <TryOnButton
          ready={isReady}
          loading={loading}
          loadingStep={loadingStep}
          onClick={handleTryOn}
        />

        <HistoryPanel
          history={history}
          onView={handleViewHistory}
          onClear={() => setHistory([])}
        />

        <HowItWorks />
      </div>

      {showResult && result && (
        <ResultModal
          result={result}
          productPreview={activeProductPreview}
          userPreview={activeUserPreview}
          onClose={() => setShowResult(false)}
          onReset={() => {
            setShowResult(false);
            setResult(null);
            clearProduct();
            setUserImage(null);
            setUserPreview(null);
          }}
        />
      )}
    </main>
  );
}

function HowItWorks() {
  const steps = [
    { num: "01", title: "Add a product", desc: "Paste any Instagram post URL or upload a product photo directly." },
    { num: "02", title: "Upload your photo", desc: "A selfie for clothing, or a room photo for furniture and decor." },
    { num: "03", title: "See the result", desc: "Our AI segments the product and places it on you realistically. Done in seconds." },
  ];
  return (
    <div className="mt-8 mb-12">
      <div className="h-px w-full mb-10" style={{ background: "rgba(255,255,255,0.06)" }} />
      <p className="section-label text-center mb-8">How it works</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((s) => (
          <div key={s.num} className="rounded-2xl p-6" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-4xl font-black mb-4" style={{ background: "linear-gradient(135deg,rgba(124,58,237,0.4),rgba(236,72,153,0.4))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              {s.num}
            </div>
            <h3 className="text-white font-semibold mb-2">{s.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
