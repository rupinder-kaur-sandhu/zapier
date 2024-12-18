import { Appbar } from "@/components/Appbar";
import { Hero } from "@/components/Hero";
import { HeroVideo } from "@/components/HeroVideo";

export default function Home() {
  return (
    <main className="pb-48">
      <Appbar></Appbar>
      <Hero></Hero>
      <div className="pt-8">
        <HeroVideo></HeroVideo>
      </div>
    </main>
  );
}
