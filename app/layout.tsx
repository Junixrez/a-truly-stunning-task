import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PromptVibe - Refine Your Website Ideas",
  description: "Transform rough website concepts into polished, detailed prompts. Let AI elevate your ideas with precision and clarity.",
  keywords: ["prompt refinement", "AI", "website ideas", "creative prompts"],
  authors: [{ name: "PromptVibe" }],
  openGraph: {
    title: "PromptVibe - Refine Your Website Ideas",
    description: "Transform rough website concepts into polished, detailed prompts.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased gradient-bg`}
      >
        {children}
      </body>
    </html>
  );
}
