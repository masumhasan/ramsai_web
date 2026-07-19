# 🚀 GocalAI - AI-Powered Fitness & Nutrition Partner

GocalAI is a premium, modern, and highly interactive web application designed to help users scan meals for calorie tracking and receive personalized AI-generated workout routines. Built with a mobile-first, dark-themed responsive layout, the platform offers a sleek, glassmorphic UI with smooth micro-animations.

---

## ✨ Features

- **📸 Instant Calorie Tracking:** Skip the manual logs. Snap a photo of your plate, and our AI scanner instantly identifies the food, breaking down calories, protein, carbs, and fats. Includes a live camera viewport mockup with a scanning laser line.
- **🏋️ Smart AI Workouts:** Custom routines tailored to your body type, fitness level, and personal goals. Routines evolve dynamically with your progress.
- **⚡ How It Works (3 Steps):** Simple, edge-to-edge interactive cards guiding users from setting goals, scanning & training, to tracking visual progress reports.
- **💳 Pricing Plans:** Clean basic and premium tier comparison cards utilizing official Shadcn UI structures and full-width CTA buttons.
- **📱 Responsive Mobile Frame:** Centered mobile viewport styling (`max-w-480`) giving users a native app experience directly in their web browsers.
- **🎨 Premium Dark Theme:** Beautiful oklch dark-mode palette, glowing background gradients, and custom webkit scrollbar styled for professional gaming/fitness aesthetics.

---

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/) + [Vite 6](https://vite.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/) (Card, Button)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

Make sure you have **Node.js** (v18+) and **pnpm** installed on your system.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nurulla-hasan/ramsai_website.git
   cd ramsai_website
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Start the local development server:**
   ```bash
   pnpm dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

### Production Build

To compile TypeScript and build the production bundle:
```bash
pnpm build
```
This output is saved to the `/dist` directory, fully optimized and ready to deploy to Vercel, Netlify, or any static hosting platform.

---

## 📂 Project Structure

```text
src/
├── assets/             # Brand logos, store SVGs, and food/dumbbell illustrations
├── components/
│   ├── animation/      # Framer Motion transition & collapse helpers
│   ├── common/         # Navbar, Footer, and Custom SVG Icons
│   ├── home/           # Hero, Scanner, Workouts, Steps, and Pricing components
│   └── ui/             # Shadcn UI base components (Button, Card)
├── layout/             # Shared main and auth layout templates
├── lib/                # Utility helper functions (cn class merger)
├── pages/              # Home page and legal page templates (Terms, Privacy)
├── providers/          # Theme context provider
├── router.tsx          # React Router browser routes definitions
├── index.css           # Global CSS variables, fonts, and scrollbar theme
└── main.tsx            # Main React application mount point
```
