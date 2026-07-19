import AnimatedContent from "@/components/animation/animated-content";
import { UserPlus, Dumbbell, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export default function Steps() {
  const steps = [
    {
      number: "01",
      icon: UserPlus,
      title: "Set Up Your Goal",
      description: "Tell us your fitness goals, body preferences, and diet targets to let our AI customize your plan.",
    },
    {
      number: "02",
      icon: Dumbbell,
      title: "Scan & Train",
      description: "Snap photos of your meals to track calories instantly and follow your custom daily workouts.",
    },
    {
      number: "03",
      icon: TrendingUp,
      title: "See Your Progress",
      description: "Monitor your daily achievements and watch your health improve with clear, visual progress reports.",
    },
  ];

  return (
    <section id="how-it-works" className="section-wrapper relative">
      {/* Background Glow */}
      <div className="absolute bottom-0 -right-48 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Part */}
      <div className="flex flex-col items-start text-left max-w-xl mb-12">
        <AnimatedContent direction="up" delay={0.1}>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            GET STARTED
          </span>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.2}>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-foreground mt-3">
            How It Works in 3 Simple <span className="text-primary bg-clip-text">Steps</span>
          </h2>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.3}>
          <p className="text-muted-foreground text-sm md:text-base mt-3 leading-relaxed max-w-md">
            Start your fitness journey in minutes. No complex setups.
          </p>
        </AnimatedContent>
      </div>

      {/* 3-Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <AnimatedContent
              key={step.number}
              direction="up"
              delay={0.1 * (idx + 1)}
              className="group h-full"
            >
              {/* HTML Wrapper for hover lift, border transitions, and height */}
              <div className="h-full rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/5 border border-transparent hover:border-primary/40">
                <Card>
                  {/* Top Header Section */}
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      {/* Circle Icon Wrapper */}
                      <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center bg-primary/5 group-hover:border-primary/60 transition-colors duration-300">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      {/* Step Number */}
                      <span className="text-sm font-bold text-muted-foreground/40 group-hover:text-primary/40 transition-colors duration-300">
                        {step.number}
                      </span>
                    </div>
                  </CardHeader>

                  {/* Horizontal Divider Line */}
                  <div className="w-full h-px bg-border/60 my-2" />

                  {/* Main Card Content */}
                  <CardContent>
                    <div className="flex flex-col gap-3 pt-2">
                      {/* Title */}
                      <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </AnimatedContent>
          );
        })}
      </div>
    </section>
  );
}
