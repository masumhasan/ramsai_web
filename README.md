# 🚀 GocalAI Web App & Admin Dashboard

GocalAI is a modern, high-performance web application and administrative management dashboard for the GocalAI fitness and nutrition ecosystem. Built with React 19, TypeScript, Vite, and Tailwind CSS v4, it features a glassmorphic landing page, full legal documentation, and a feature-rich Admin Dashboard for user & subscription plan management.

---

## ✨ Key Features & Capabilities

### 🌐 Landing Page & Marketing Portal
- **📸 AI Calorie Tracker Showcase:** Interactive demonstration of AI plate scanning, macro breakdown (calories, protein, carbs, fats), and live camera scanner line animation.
- **🏋️ Smart AI Workout Routines:** Highlights personalized workout plans, body goal tracking, and daily routine builders.
- **📄 Clean Legal Routing:** Updated, SEO-optimized routes for Privacy Policy (`/privacy`) and Terms of Service (`/terms`).
- **📱 Responsive Mobile Experience:** Centered mobile app viewport layout (`max-w-480`) allowing users to experience GocalAI directly on any browser.

---

### 👑 Admin Management Dashboard (`/admin/dashboard`)
- **🔐 Secure Superadmin Authentication:** Admin sign-in route (`/admin/login`) connected directly to the live backend.
- **📊 Real-time Analytics & System Overview:** Live stats cards tracking Total Registered Users, Active Users, Active Subscriptions, and Daily AI Scans.
- **👥 User Management System:**
  - Complete user directory with email, registration date, age, gender, and onboarding completion status.
  - Subscription tier badges (`BASIC` / `PREMIUM`).
  - Account moderation actions (Ban / Unban user accounts instantly).
- **💳 Subscription Plans Management:**
  - Dedicated Subscription Plans tab displaying luxury tier cards.
  - **Basic Plan ($0.00/monthly):** 3 AI Food Scans/day, 2 Product Scans (barcode+ocr)/day, Standard workouts, Basic calorie tracking.
  - **Premium Plan ($4.99/monthly):** Unlimited AI Food Scans, Unlimited Product Scans (barcode+ocr), Personalized AI Workout Plans, Detailed Nutrient Reports.
- **✏️ Dynamic Plan Editor Modal (`PlanEditModal`):** Superadmins can dynamically adjust plan prices, feature checklists, and daily scan limits directly from the web interface.

---

## 🛠️ Tech Stack

- **Frontend Core:** [React 19](https://react.dev/) + [Vite 6](https://vite.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling & Components:** [Tailwind CSS v4](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **API Client:** Axios / Fetch API integrated with AWS Deployed Backend (`https://backend.getgocal.com/api`)

---

## 📂 Project Structure

```text
ramsai_web/
├── public/                 # Static public assets
├── src/
│   ├── assets/             # SVGs, fonts, and fitness illustrations
│   ├── components/
│   │   ├── animation/      # Framer motion transition utilities
│   │   ├── common/         # Navbar, Footer, and branding components
│   │   ├── home/           # Landing page sections (Hero, Scanner, Workouts, Pricing)
│   │   └── ui/             # Base UI components (Button, Card, Dialog, Badge)
│   ├── layout/             # Main and Dashboard page layouts
│   ├── lib/                # API client (`api.ts`) and utility functions
│   ├── pages/
│   │   ├── dashboard/      # Admin Dashboard & PlanEditModal components
│   │   ├── Privacy.tsx     # Privacy Policy page (`/privacy`)
│   │   ├── Terms.tsx       # Terms & Conditions page (`/terms`)
│   │   └── AdminLogin.tsx  # Admin Login page (`/admin/login`)
│   ├── router.tsx          # React Router v7 definitions
│   ├── index.css           # Tailwind v4 styles & custom scrollbars
│   └── main.tsx            # React application entry point
├── .env                    # Environment variables (VITE_API_URL)
└── vite.config.ts          # Vite build configuration
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have **Node.js** (v18+) and **npm** installed.

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/masumhasan/ramsai_web.git
   cd ramsai_web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create or edit `.env` in the root directory:
   ```env
   VITE_API_URL=https://backend.getgocal.com/api
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## ☁️ EC2 Production Deployment Guide

To deploy and run the web dashboard on AWS EC2 (Port 3000) using PM2:

```bash
# 1. Pull latest code and build production bundle
git pull
npm install
npm run build

# 2. Install 'serve' globally for SPA static hosting
sudo npm install -g serve

# 3. Start static server on port 3000 using PM2
pm2 start serve --name "ramsai-web" -- dist -s -l 3000

# 4. Save PM2 state
pm2 save
```

Access the live dashboard at: `https://getgocal.com` or `https://www.getgocal.com`
