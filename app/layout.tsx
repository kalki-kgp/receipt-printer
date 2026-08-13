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

/* Applied before paint so the first frame is already in the right theme.
   `?theme=light` / `?theme=dark` pins it; otherwise follow the system. */
const themeScript = `(() => {
  const pinned = new URLSearchParams(location.search).get("theme");
  const dark = pinned
    ? pinned === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", dark);
})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: pre-paint theme sync */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-grayscale-2 text-grayscale-12 antialiased">
        {children}
      </body>
    </html>
  );
}
