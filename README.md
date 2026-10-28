# 🛍️ ShopLens — Try Before You Buy on Instagram

> **See any Instagram product on yourself before buying.**  
> Built for the [Meta Global AI Developer Hackathon 2026](https://cerebralvalley.ai/e/meta-ai-developer-hackathon).

**Powered by Meta SAM 3.1 + Muse Image + Muse Spark Vision**

---

## The Problem

70% of online returns happen because the product didn't look right on the buyer. People see a jacket on Instagram. They love it. They buy it. It doesn't fit their style. They return it.

Instagram Shopping has 130M+ users tapping product tags every month. Zero of them can see the product on themselves before buying.

**ShopLens fixes that.**

---

## What It Does

1. **Paste any Instagram product post URL** — or upload a product photo directly
2. **Upload your photo** — selfie for clothing/accessories, room photo for furniture
3. **See yourself wearing it** — Meta's AI composites the product onto you realistically
4. **Share to Stories** — show your followers what you're thinking of buying

---

## Tech Stack

```
Frontend    Next.js 14 + Tailwind CSS + TypeScript
Backend     FastAPI + Python
Vision      Muse Spark 1.3 (product analysis + segmentation)  
Compositing Muse Image 1.0 (try-on generation)
Platform    Instagram (product source)
```

---

## Quick Start

### Backend

```bash
cd backend
pip install -r requirements.txt
# .env already has your API key
python main.py
```

API runs at `http://localhost:8000`  
Interactive docs at `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

App runs at `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/fetch-instagram` | Fetch product image from Instagram URL |
| POST | `/analyze-product` | Analyze product with Muse Spark Vision |
| POST | `/try-on` | Generate try-on image |

### Try-On Request

```json
{
  "instagram_url": "https://www.instagram.com/p/...",
  "user_image_base64": "...",
  "user_type": "person"
}
```

### Try-On Response

```json
{
  "result_image_base64": "...",
  "product_name": "White Linen Blazer",
  "product_category": "clothing",
  "product_description": "...",
  "try_on_type": "wear_on_person"
}
```

---

## The Pitch

*"See any Instagram product on yourself before buying. One tap. Five seconds. No more returns."*

---

*Built for Meta Global AI Developer Hackathon 2026 — Indie Developer Track*
