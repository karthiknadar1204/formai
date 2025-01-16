import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';

const dm_sans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Formify - Form Builder",
  description: "Formify - Form Builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`bg-white ${dm_sans.className} antialiased`}>
        {children}
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}