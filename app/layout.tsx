import type { Metadata } from "next";
import { Playpen_Sans } from "next/font/google";
import "./globals.css";

const playpenSans = Playpen_Sans({
  variable: "--font-playpen-sans",
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: "400",
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
        className={`${playpenSans.variable} antialiased gradient-bg`}
      >
        {children}
      </body>
    </html>
  );
}
