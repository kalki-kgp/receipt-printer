import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Receipt Printer",
  description: "An animated thermal receipt printer component for React.",
};

export const viewport: Viewport = {
  colorScheme: "light dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-grayscale-2 text-grayscale-12 antialiased dark:bg-grayscale-1 dark:text-grayscale-12">
        {children}
      </body>
    </html>
  );
}
