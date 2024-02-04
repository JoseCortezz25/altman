import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

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
      <body className={inter.className}>{children}</body>
      <Toaster />
    </html>
  );
}
