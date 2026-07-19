import AnimatedContent from "@/components/animation/animated-content";
import heroImage from "@/assets/hero.png";
import playStoreLogo from "@/assets/play-store.svg";
import appleStoreLogo from "@/assets/apple-store.svg";
import { Link } from "react-router";
import HoverLaserBorder from "@/components/animation/HoverLaserBorder";

export default function Hero() {
  return (
    <section id="home" className="body-height py-8 sm:py-0 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
      {/* Left Column: Text & Call to Action */}
      <div className="flex-1 flex flex-col items-start text-left max-w-xl">
        <AnimatedContent direction="left" delay={0.1}>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
            GoCalAI Your <span className="text-primary bg-clip-text">AI-Powered</span> Fitness Partner in Your Pocket!
          </h1>
        </AnimatedContent>

        <AnimatedContent direction="left" delay={0.2}>
          <p className="text-muted-foreground text-sm md:text-base mt-3 leading-relaxed max-w-md">
            Get personalized workout plans tailored to your body and scan your food to
            instantly track calories—all in one intuitive app.
          </p>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.3}>
          <div className="flex flex-row items-center gap-6 mt-6 w-full">
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

      {/* Right Column: Image Frame */}
      <div className="flex-1 flex justify-center md:justify-end w-full">
        <AnimatedContent direction="right" delay={0.2} className="w-full max-w-sm md:max-w-md">
          <img
            src={heroImage}
            alt="GoCalAI Workout Partner"
            className="w-full h-auto rounded-2xl border border-border/80 shadow-2xl select-none"
            loading="eager"
          />
        </AnimatedContent>
      </div>
    </section>
  );
}
