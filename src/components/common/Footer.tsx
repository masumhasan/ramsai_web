import { Link } from "react-router";
import logo from "@/assets/logo.svg";
import { LinkedInIcon, FacebookIcon, TwitterIcon } from "./Icons";

export const Footer = () => {
  return (
    <footer className="w-full bg-card mt-auto relative">
      {/* Premium Gradient Top Border Line */}
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-border/50 to-transparent" />

      <div className="section-container pt-16 pb-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
          {/* Brand/Logo Column */}
          <div className="flex flex-col items-start gap-4">
            <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <img src={logo} alt="Gocal AI Logo" className="h-9 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px]">
              Your AI-Powered Fitness & Nutrition Partner.
            </p>
          </div>

          {/* Explore Column */}
          <div className="flex flex-col gap-4">
            <h4 className="font-heading text-sm font-bold tracking-wider text-foreground">
              Explore
            </h4>
            <nav className="flex flex-col gap-2">
              <Link to="/#home" className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all duration-200 inline-block w-fit">
                Home
              </Link>
              <Link to="/#features" className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all duration-200 inline-block w-fit">
                Features
              </Link>
              <Link to="/#how-it-works" className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all duration-200 inline-block w-fit">
                How It Works
              </Link>
              <Link to="/#about" className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all duration-200 inline-block w-fit">
                About GocalAI
              </Link>
            </nav>
          </div>

          {/* Legal Column */}
          <div className="flex flex-col gap-4">
            <h4 className="font-heading text-sm font-bold tracking-wider text-foreground">
              Legal
            </h4>
            <nav className="flex flex-col gap-2">
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all duration-200 inline-block w-fit">
                Terms & Conditions
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all duration-200 inline-block w-fit">
                Privacy Policy
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} GocalAI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-border/60 hover:border-primary hover:bg-primary hover:text-primary-foreground flex items-center justify-center text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              <LinkedInIcon className="w-4 h-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-border/60 hover:border-primary hover:bg-primary hover:text-primary-foreground flex items-center justify-center text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              <FacebookIcon className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full border border-border/60 hover:border-primary hover:bg-primary hover:text-primary-foreground flex items-center justify-center text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              <TwitterIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};