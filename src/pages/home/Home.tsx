import Hero from "@/components/home/Hero";
import Scanner from "@/components/home/Scanner";
import Workouts from "@/components/home/Workouts";
import Steps from "@/components/home/Steps";
import AboutApp from "@/components/home/AboutApp";
import Pricing from "@/components/home/Pricing";

export default function Home() {
  return (
    <main className="section-container">
      <Hero />
      <Scanner />
      <Workouts />
      <Steps />
      <Pricing />
      <AboutApp />
    </main>
  );
}