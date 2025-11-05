import type { Metadata } from "next";
import { Geist, Geist_Mono, Prompt } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "เครื่องมือคำนวณจำนวน Slot และงบประมาณ",
  description:
    "คำนวณจำนวน Slot และงบประมาณตามแผนการเรียนของนักเรียน เพื่อให้แน่ใจว่า นักเรียนจะบรรลุเป้าหมายได้ทันในงบที่จำกัด",
  // Note: Next.js handles charset and viewport meta tags automatically.
  // To add the icon, place a "favicon.ico" or "icon.svg"
  // (renamed from vite.svg) in your "app/" directory.
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${geistSans.className} ${geistMono.className} ${prompt.className} antialiased bg-slate-50`}
      >
        {children}
      </body>
    </html>
  );
}
