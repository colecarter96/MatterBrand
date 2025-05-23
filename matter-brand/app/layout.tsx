import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Matter Brand - Split View Dashboard",
  description: "An avant-garde split view dashboard for content management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-secondary text-primary min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
