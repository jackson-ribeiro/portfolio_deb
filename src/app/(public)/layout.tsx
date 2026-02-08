import { Header } from "@/components/portfolio/Header";
import { Footer } from "@/components/portfolio/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header name="Déborah" />
      <main className="pt-16 min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
