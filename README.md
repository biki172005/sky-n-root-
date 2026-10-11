# SKYnROOT SKINCARE ✦ Natural Skincare Meets Modern Luxury

An award-winning, luxury e-commerce and interactive 3D WebGL experience for **SKYnROOT SKINCARE**. Featuring cold-pressed wild botanicals, glass circularity, and interactive 3D product customization.

---

## ✨ Features

- **Interactive 3D WebGL Bottle Experience**:
  - Built with Three.js with realistic glass refraction, chromatic dispersion, and lighting.
  - 360° mouse drag orbit interaction.
  - Interactive formula color customizer (Amber Botanical, Sage Infusion, Pure Hydration, Blackberry Shield).
- **Luxury Brand Aesthetic**:
  - Bespoke editorial serif typography and custom calligraphy wordmark.
  - Deep forest green (`#243B2E`), Sage (`#A6B39A`), Warm ivory (`#F7F5EF`), and Muted champagne gold (`#B9A77A`).
  - Fluid micro-interactions and GSAP ScrollTrigger cinematic section reveals.
- **Complete E-Commerce Suite**:
  - Full catalog of 9 signature products with Indian Rupee (`₹`) pricing.
  - Interactive filter tabs (All, Serums, Cleansers, Moisturizers, Sun Protection).
  - Quick view modal with formulation breakdown, botanical profiles, ritual protocols, and clinical safety ratings.
  - Slide-out Cart Drawer with localStorage persistence, free shipping milestone progress bar, and promo discount codes (`NATURE10`).
  - Slide-out Wishlist Drawer.
  - Live modal search with instant keyword highlighting.
  - Complete multi-step checkout dialog with order confirmation receipt.
  - Interactive 5-Step Skincare Ritual builder with one-click full bundle addition.

---

## 🚀 Live Deployment on Vercel

This project is pre-configured for instant zero-configuration deployment on **Vercel**:

### Option 1: Automatic GitHub Import (Recommended)
1. Go to [Vercel Dashboard](https://vercel.com/new).
2. Connect your GitHub account and import the repository: `https://github.com/biki172005/sky-n-root-`.
3. Keep the default settings (Framework: *Other*, Root Directory: `./`).
4. Click **Deploy**. Vercel will instantly publish the live website with SSL and global CDN!

### Option 2: Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 💻 Local Development

You can run this project locally without any dependencies or build steps:

### Using Python:
```bash
python -m http.server 3000
```
Then visit `http://localhost:3000/`.

### Using Node.js:
```bash
npx serve .
```

### Using PowerShell (Windows):
```powershell
.\server.ps1
```

---

## 📁 Project Structure

```
├── assets/
│   └── images/               # High-resolution packaging renders & official logo
├── css/
│   └── style.css             # Vanilla CSS luxury design system & responsive layout
├── js/
│   ├── cart.js               # E-commerce cart, wishlist, search & checkout engine (INR)
│   ├── main.js               # App controller, GSAP animations & ritual builder
│   ├── products.js           # Full product database with botanical profiles
│   └── three-hero.js         # Interactive Three.js WebGL 3D serum bottle
├── index.html                # Semantic HTML5 single-page application
├── package.json              # Project metadata & npm scripts
├── vercel.json               # Vercel deployment & asset caching configuration
└── README.md                 # Documentation
```

---

## 📄 License

MIT © [SKYnROOT SKINCARE](https://github.com/biki172005/sky-n-root-)
