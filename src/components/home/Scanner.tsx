import AnimatedContent from "@/components/animation/animated-content";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import foodImage from "@/assets/healthy-rice-vegetable.png";

export default function Scanner() {
  return (
    <section id="features" className="section-wrapper flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
      {/* Left Column: Text Content */}
      <div className="flex-1 flex flex-col items-start text-left max-w-xl">
        <AnimatedContent direction="left" delay={0.1}>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            INSTANT CALORIE TRACKING
          </span>
        </AnimatedContent>

        <AnimatedContent direction="left" delay={0.2}>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-foreground mt-3">
            Snap, <span className="text-primary bg-clip-text">Scan</span>, and Track.
          </h2>
        </AnimatedContent>

        <AnimatedContent direction="left" delay={0.3}>
          <p className="text-muted-foreground text-sm md:text-base mt-4 leading-relaxed max-w-md">
            Skip the tedious manual logging. Just take a picture of your plate, and our
            advanced AI scanner instantly identifies the food and breaks down its calories,
            protein, carbs, and fats.
          </p>
        </AnimatedContent>
      </div>

      {/* Right Column: Scanned Meal & Visual Scanner Preview */}
      <div className="flex-1 flex justify-center md:justify-end w-full">
        <AnimatedContent direction="right" delay={0.2} className="w-full max-w-[320px] md:max-w-[360px] relative">
          {/* Card Overlay (Scanned Meal Detail) */}
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute top-0 sm:-top-8 left-0 sm:-left-50 z-50 w-60 sm:w-64 bg-card/50 border border-border/85 rounded-2xl p-5 backdrop-blur-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                SCANNED MEAL
              </span>
              <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Check className="w-3 h-3 text-primary" />
              </div>
            </div>

            <div className="mt-3">
              <span className="text-2xl font-bold text-primary font-heading">400</span>{" "}
              <span className="text-xs text-muted-foreground font-medium">kcal</span>
            </div>
            <h4 className="text-sm font-bold text-foreground mt-1 leading-snug">
              Chicken Salad & Rice
            </h4>

            {/* Nutrients List */}
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border/40">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Protein</span>
                <span className="font-semibold text-foreground">25g</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Carbs</span>
                <span className="font-semibold text-foreground">15</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Fats</span>
                <span className="font-semibold text-foreground">10g</span>
              </div>
            </div>
          </motion.div>

          {/* Scanner View Frame */}
          <div className="relative rounded-2xl overflow-hidden aspect-square w-full flex items-center justify-center p-10">
            {/* Brackets */}
            {/* Top Left */}
            <div className="absolute top-6 left-6 w-14 h-14 border-t-8 border-l-8 border-primary rounded-tl-xl z-20" />
            {/* Top Right */}
            <div className="absolute top-6 right-6 w-14 h-14 border-t-8 border-r-8 border-primary rounded-tr-xl z-20" />
            {/* Bottom Left */}
            <div className="absolute bottom-6 left-6 w-14 h-14 border-b-8 border-l-8 border-primary rounded-bl-xl z-20" />
            {/* Bottom Right */}
            <div className="absolute bottom-6 right-6 w-14 h-14 border-b-8 border-r-8 border-primary rounded-br-xl z-20" />

            {/* Laser Scan Line (Sliding up and down) */}
            <motion.div
              animate={{ top: ["15%", "85%", "15%"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-6 right-6 h-[4px] bg-primary shadow-[0_0_15px_var(--primary),0_0_5px_var(--primary)] rounded-full z-10"
            />

            {/* Food Image */}
            <img
              src={foodImage}
              alt="Meal Scan Preview"
              className="w-full h-full object-contain rounded-xl select-none"
              loading="lazy"
            />

            {/* Bottom 50% Primary Gradient Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-linear-to-t from-primary/20 to-transparent pointer-events-none z-10" />
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
