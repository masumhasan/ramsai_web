import AnimatedContent from "@/components/animation/animated-content";
import { motion } from "framer-motion";
import dumbleImage from "@/assets/dumble.png";

export default function Workouts() {
  return (
    <section className="section-wrapper flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
      {/* Left Column: Floating Dumbbell with soft radial glow */}
      <div className="flex-1 flex justify-center md:justify-start w-full relative">
        <AnimatedContent direction="left" delay={0.2} className="relative flex justify-center items-center w-full max-w-[380px] md:max-w-[440px]">
          {/* Premium Soft Radial Blue Glow Behind Dumbbell */}
          <div className="absolute w-80 h-80 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

          {/* Dumbbell Image with floating micro-animation */}
          <motion.img
            animate={{ y: [-8, 8, -8], rotate: [0, 1, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            src={dumbleImage}
            alt="AI Workouts Dumbbell"
            className="w-full h-auto object-contain select-none z-10 max-w-[320px] sm:max-w-[380px] md:max-w-[420px]"
            loading="lazy"
          />
        </AnimatedContent>
      </div>

      {/* Right Column: Text Content */}
      <div className="flex-1 flex flex-col items-start text-left max-w-xl">
        <AnimatedContent direction="right" delay={0.1}>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            AI WORKOUTS
          </span>
        </AnimatedContent>

        <AnimatedContent direction="right" delay={0.2}>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-foreground mt-3">
            Smart <span className="text-primary bg-clip-text">Routines</span>, Built for Your Body.
          </h2>
        </AnimatedContent>

        <AnimatedContent direction="right" delay={0.3}>
          <p className="text-muted-foreground text-sm md:text-base mt-4 leading-relaxed max-w-md">
            No guesswork needed. Our smart AI analyzes your body type and fitness goals to
            recommend a customized, step-by-step workout routine that evolves with you.
          </p>
        </AnimatedContent>
      </div>
    </section>
  );
}
