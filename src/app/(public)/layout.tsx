import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-full flex flex-col">
      <Navbar />
      <main className="h-screen grow">{children}</main>
      <Footer />
    </div>
  );
}