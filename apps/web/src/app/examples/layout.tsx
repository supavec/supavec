import { Header } from "@/components/sections/header";
import { Footer } from "@/components/sections/footer";
import { CTA } from "./chat-with-pdf/_components/cta";

export default async function ExamplesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="w-full container mx-auto">
        <div className="border-x border-b pt-12 md:pt-24 pb-6">{children}</div>
        <CTA />
      </main>
      <Footer />
    </>
  );
}
