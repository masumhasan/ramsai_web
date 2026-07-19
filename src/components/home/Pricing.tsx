import AnimatedContent from "@/components/animation/animated-content";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Check, X } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Basic Plan",
      price: "$0.00",
      isPopular: false,
      buttonText: "Buy Now",
      buttonVariant: "outline" as const,
      features: [
        { text: "3 AI Food Scans per day", included: true },
        { text: "Standard workout routines", included: true },
        { text: "Basic calorie tracking", included: true },
        { text: "Advanced macro breakdown", included: false },
      ],
    },
    {
      name: "Premium Plan",
      price: "$4.99",
      isPopular: true,
      buttonText: "Buy Now",
      buttonVariant: "default" as const,
      features: [
        { text: "Unlimited AI Food Scans", included: true },
        { text: "Personalized AI Workout Plans", included: true },
        { text: "Detailed Macro & Nutrient Reports", included: true },
      ],
    },
  ];

  return (
    <section className="section-wrapper relative">
      {/* Background Glow */}
      <div className="absolute top-1/3 -left-24 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Part */}
      <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-12">
        <AnimatedContent direction="up" delay={0.1}>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            PRICING PLANS
          </span>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.2}>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-foreground mt-3">
            Choose the Perfect <span className="text-primary bg-clip-text">Plan</span> for Your Fitness Goals
          </h2>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={0.3}>
          <p className="text-muted-foreground text-sm md:text-base mt-3 leading-relaxed">
            Start for free and upgrade anytime to unlock advanced AI features.
          </p>
        </AnimatedContent>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        {plans.map((plan, idx) => (
          <AnimatedContent
            key={plan.name}
            direction="up"
            delay={0.15 * (idx + 1)}
            className="w-full relative h-full flex"
          >
            {/* HTML Wrapper for hover lift, border highlighting, and container bounds */}
            <div className={`w-full rounded-xl transition-all duration-300 hover:-translate-y-1 relative flex flex-col justify-between border ${
              plan.isPopular
                ? "border-primary/40 shadow-2xl shadow-primary/5"
                : "border-border/60 hover:border-border"
            }`}>
              {/* Popular Badge */}
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 px-3 py-1 bg-zinc-900 border border-primary/30 rounded-full text-[10px] font-bold text-foreground flex items-center gap-1 shadow-lg">
                  <span>🔥</span> Popular
                </div>
              )}

              <Card className="flex-1 flex flex-col justify-between">
                <div>
                  <CardHeader>
                    <div className="flex flex-col gap-1">
                      {/* Plan Title */}
                      <h3 className="text-xl font-bold text-foreground">
                        {plan.name}
                      </h3>
                      {/* Price Section */}
                      <div className="flex items-baseline mt-2">
                        <span className="text-4xl font-extrabold text-primary font-heading">
                          {plan.price}
                        </span>
                        <span className="text-xs text-muted-foreground font-semibold ml-1.5">
                          /monthly
                        </span>
                      </div>
                    </div>

                    {/* CTA Button Wrapper (forcing full width on pure Shadcn Button child) */}
                    <div className="w-full mt-4 flex *:w-full">
                      <Button variant={plan.buttonVariant}>
                        {plan.buttonText}
                      </Button>
                    </div>
                  </CardHeader>

                  {/* Horizontal Divider Line */}
                  <div className="w-full h-px bg-border/20 my-2" />

                  <CardContent>
                    {/* Features List */}
                    <div className="flex flex-col gap-4 py-2">
                      {plan.features.map((feature) => (
                        <div
                          key={feature.text}
                          className="flex items-center gap-3 text-left"
                        >
                          {feature.included ? (
                            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0">
                              <Check className="w-3.5 h-3.5 stroke-3" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border border-muted-foreground/30 flex items-center justify-center text-muted-foreground/50 shrink-0">
                              <X className="w-3.5 h-3.5" />
                            </div>
                          )}
                          <span className={`text-sm ${
                            feature.included
                              ? "text-foreground"
                              : "text-muted-foreground/60 line-through"
                          }`}>
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          </AnimatedContent>
        ))}
      </div>
    </section>
  );
}
