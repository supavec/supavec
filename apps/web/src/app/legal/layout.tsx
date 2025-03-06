import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <main>{children}</main>
      </div>
      <Footer className="border-t" />
    </>
  );
}
