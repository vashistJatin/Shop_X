import "./globals.css";
import StoreProvider from "@/store/StoreProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "ShopX — Premium Shopping",
  description: "Discover the best products at unbeatable prices. Built by Jatin Sharma.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="flex flex-col min-h-screen">
        <StoreProvider>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
