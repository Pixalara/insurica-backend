import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * Insurica Global Metadata
 * This updates the browser tab title and SEO information.
 */
export const metadata: Metadata = {
  title: "Insurica - A Simple Agent Dashboard",
  description: "Digital Experiences. Engineered to Scale. Powered by Pixalara.",
  icons: {
    icon: "/favicon.ico", // Ensure you have a favicon in your /public folder
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased bg-slate-50`}>
        {children}
      </body>
    </html>
  );
}