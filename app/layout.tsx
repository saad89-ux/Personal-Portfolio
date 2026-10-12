import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "S&K — Independent creative studio",
  description: "We turn direction into identity. Strategy, brand design, web design, and motion.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Browser extensions can inject attributes into <body> before React hydrates.
  // Suppress the resulting one-level hydration warning for those external attributes.
  return <html lang="en"><body suppressHydrationWarning>{children}</body></html>;
}
