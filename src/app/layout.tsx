import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Altman",
  description: "A simple web app to generate alt text for images using Google's Generative AI",
  authors: [{ name: "@josecortezz25", url: "https://alfonso-portafolio.vercel.app/" }],
  openGraph: {
    title: "Altman",
    description: "A simple web app to generate alt text for images using Google's Generative AI",
    type: "website",
    url: "https://altman.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="h-screen flex flex-col items-stretch justify-between">
          {children}
          <Footer />
        </main>
      </body>
      <Toaster />
    </html>
  );
}
