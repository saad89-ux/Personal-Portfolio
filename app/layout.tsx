import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Produx — Independent creative studio",
  description: "We turn direction into identity. Strategy, brand design, web design, and motion.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
