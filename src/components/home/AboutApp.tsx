import AnimatedContent from "@/components/animation/animated-content";
import { Link } from "react-router";
import mockupPhone from "@/assets/mockup-phone.svg";
import playStoreLogo from "@/assets/play-store.svg";
import appleStoreLogo from "@/assets/apple-store.svg";
import HoverLaserBorder from "@/components/animation/HoverLaserBorder";

export default function AboutApp() {
  return (
    <section id="about" className="section-wrapper flex flex-col md:flex-row items-center justify-between gap-5 md:gap-12">
      {/* Left Column: Phone Mockups with soft radial glow */}
      <div className="flex-1 flex justify-center md:justify-start w-full relative">
        <AnimatedContent direction="left" delay={0.2} className="relative flex justify-center items-center w-full max-w-[360px] sm:max-w-[420px] md:max-w-[480px]">
          {/* Soft Radial Blue Glow Behind Mockup */}
          <div className="absolute w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          {/* Phone Mockup SVG */}
          <img
            src={mockupPhone}
            alt="GocalAI App Mockup"
            className="w-full h-auto object-contain select-none z-10"
            loading="lazy"
          />
        </AnimatedContent>
      </div>

      {/* Right Column: Text Content & Store Badges */}
      <div className="flex-1 flex flex-col items-start text-left max-w-xl">
        <AnimatedContent direction="right" delay={0.1}>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            ABOUT THE APP
          </span>
        </AnimatedContent>

        <AnimatedContent direction="right" delay={0.2}>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-foreground mt-3">
            Get the Ultimate AI Fitness Experience with <span className="text-primary bg-clip-text">GocalAI</span>
          </h2>
        </AnimatedContent>

        <AnimatedContent direction="right" delay={0.3}>
          <p className="text-muted-foreground text-sm md:text-base mt-4 leading-relaxed max-w-md">
            GocalAI is designed to fit seamlessly into your daily routine. Whether you are
            tracking your daily meals, scanning calories, or following custom workouts, our
            app keeps you motivated and healthy 24/7.
          </p>
        </AnimatedContent>

        {/* Store Badges */}
        <AnimatedContent direction="up" delay={0.4}>
          <div className="flex flex-row items-center gap-3 mt-8 w-full">
            {/* Google Play Button */}
            <Link
              to="https://play.google.com"
              target="_blank"
              rel="noreferrer"
              className="relative group overflow-hidden rounded-xl border border-border/60 transition-all duration-300 hover:border-primary/40 hover:scale-[1.03] active:scale-95 shrink-0"
            >
              <img
                src={playStoreLogo}
                alt="Get it on Google Play Store"
                className="h-11 md:h-14 w-auto select-none"
              />

              {/* Walking border laser glow on hover */}
              <HoverLaserBorder />
            </Link>

            {/* App Store Button */}
            <Link
              to="https://apple.com"
              target="_blank"
              rel="noreferrer"
              className="relative group overflow-hidden rounded-xl border border-border/60 transition-all duration-300 hover:border-primary/40 hover:scale-[1.03] active:scale-95 shrink-0"
            >
              <img
                src={appleStoreLogo}
                alt="Download on the App Store"
                className="h-11 md:h-14 w-auto select-none"
              />

              {/* Walking border laser glow on hover */}
              <HoverLaserBorder />
            </Link>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
