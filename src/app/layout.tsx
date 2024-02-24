import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/Footer";

const montserrat = Montserrat({ weight: ['500', '800'], subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://altman.vercel.app"),
  title: "Altman: Generate alternative texts for your images",
  description: "A simple web app to generate alt text for images using Google's Generative AI",
  authors: [{ name: "@josecortezz25", url: "https://alfonso-portafolio.vercel.app/" }],
  openGraph: {
    title: "Altman",
    description: "A simple web app to generate alt text for images using Google's Generative AI",
    type: "website",
    url: "https://altman.vercel.app",
    images: '/images/opengraph-image.png'
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <main className="h-screen flex flex-col items-stretch justify-between">
          {children}
          <Footer />
        </main>
      </body>
      <Toaster />
    </html>
  );
}
