import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * Viewport configuration (separate from metadata in Next.js 14+)
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f172a",
};

/**
 * Insurica Global Metadata
 * This updates the browser tab title and SEO information.
 */
export const metadata: Metadata = {
  title: "Insurica - A Simple Agent Dashboard",
  description: "Digital Experiences. Engineered to Scale. Powered by Pixalara.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Insurica",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased bg-gray-100`} suppressHydrationWarning>
        <ServiceWorkerRegistration />
        {children}
        <Toaster position="top-center" richColors duration={3000} />
      </body>
    </html>
  );
}
