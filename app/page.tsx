import Features from "@/components/site/features";
import Footer from "@/components/site/footer";
import Header from "@/components/site/header";
import Hero from "@/components/site/hero";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <div className="flex flex-col p-2">
      <Header />
      <main className="flex-1">
        <Hero />
        <Separator className="" />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
